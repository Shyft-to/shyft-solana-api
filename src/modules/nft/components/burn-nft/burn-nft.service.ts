import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { Connection } from '@metaplex/js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createBurnCheckedInstruction, createCloseAccountInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { BurnNftDto } from './dto/burn-nft.dto';
import * as bs58 from 'bs58';

@Injectable()
export class BurnNftService {
  constructor(private eventEmitter: EventEmitter2) { }
  async burnNft(burnNftDto: BurnNftDto): Promise<any> {
    try {
      const { network, address, token_address, close } = burnNftDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const addressPubKey = new PublicKey(address);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(token_address),
        addressPubKey,
      );
      const tokenAddressPubKey = new PublicKey(token_address);

      const tx = new Transaction().add(
        createBurnCheckedInstruction(
          associatedTokenAddress, // token account
          tokenAddressPubKey, // mint
          addressPubKey, // owner of token account
          1, // amount,
          0, // decimals
        ),
      );

      if (close) {
        tx.add(
          createCloseAccountInstruction(
            associatedTokenAddress, // token account which you want to close
            addressPubKey, // destination
            addressPubKey, // owner of token account
          ),
        );
      }

      const blockHash = (await connection.getLatestBlockhash('finalized'))
        .blockhash;
      tx.feePayer = addressPubKey;
      tx.recentBlockhash = blockHash;

      const transactionBuffer = tx.serializeMessage();
      return bs58.encode(transactionBuffer);

      // const nftCreationEvent = new NftDeleteEvent(token_address);
      // this.eventEmitter.emit('nft.deleted', nftCreationEvent);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
