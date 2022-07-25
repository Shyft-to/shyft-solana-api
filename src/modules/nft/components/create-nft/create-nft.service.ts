import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { Connection, transactions } from '@metaplex/js';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { NftCreationEvent } from '../../../db/db-sync/db.events';
import { Network } from 'src/dto/netwotk.dto';
import { ObjectId } from 'mongoose';
import { sign } from 'tweetnacl';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
// import { createCreateMetadataAccountV2Instruction, DataV2 } from '@metaplex-foundation/mpl-token-metadata';
import { findMetadataPda } from '@metaplex-foundation/js';
import * as bs58 from 'bs58';
import {
  CreateMasterEdition,
  CreateMetadata,
  Creator,
  MasterEdition,
  MetadataDataData,
} from '@metaplex-foundation/mpl-token-metadata-depricated';
import * as BN from 'bn.js';
export interface CreateParams {
  network: Network;
  name: string;
  symbol: string;
  address: string;
  metadataUri: string;
  maxSupply: number;
  royalty: number;
  userId: ObjectId;
}

@Injectable()
export class CreateNftService {
  constructor(private eventEmitter: EventEmitter2) {}

  async mintNft(createParams: CreateParams): Promise<unknown> {
    const { name, symbol, metadataUri, maxSupply, royalty, network, address } =
      createParams;
    if (!metadataUri) {
      throw new Error('No metadata URI');
    }
    try {
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const mintRent = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      console.log('mint', mintKeypair.publicKey.toBase58());
      
      const metadataPDA = findMetadataPda(mintKeypair.publicKey);
      const editionPDA = await MasterEdition.getPDA(mintKeypair.publicKey);
      const addressPubKey = new PublicKey(address);

      // const nftMetadata = {
      //   name,
      //   symbol,
      //   uri: metadataUri,
      //   sellerFeeBasisPoints: royalty,
      //   creators: [
      //     {
      //       address: new PublicKey(address),
      //       verified: true,
      //       share: 100,
      //     },
      //   ],
      //   collection: {
      //     verified: true,
      //     key: new PublicKey(address),
      //   },
      //   uses: null,
      // } as DataV2;

      const metadataData = new MetadataDataData({
        name,
        symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: royalty,
        creators: [
          new Creator({
            address,
            verified: true,
            share: 100,
          }),
        ],
      });

      const createMintTx = new transactions.CreateMint(
        { feePayer: addressPubKey },
        {
          newAccountPubkey: mintKeypair.publicKey,
          lamports: mintRent,
        },
      );
      console.log(createMintTx);

      const createMetadataTx = new CreateMetadata(
        {
          feePayer: addressPubKey,
        },
        {
          metadata: metadataPDA,
          metadataData,
          updateAuthority: addressPubKey,
          mint: mintKeypair.publicKey,
          mintAuthority: addressPubKey,
        },
      );
      console.log(createMetadataTx);

      const recipient = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        addressPubKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const createAssociatedTokenAccountTx =
        new transactions.CreateAssociatedTokenAccount(
          { feePayer: addressPubKey },
          {
            associatedTokenAddress: recipient,
            splTokenMintAddress: mintKeypair.publicKey,
          },
        );
        console.log(createAssociatedTokenAccountTx);

      const mintToTx = new transactions.MintTo(
        { feePayer: addressPubKey },
        {
          mint: mintKeypair.publicKey,
          dest: recipient,
          amount: 1,
        },
      );
      console.log(mintToTx);
      

      const masterEditionTx = new CreateMasterEdition(
        { feePayer: addressPubKey },
        {
          edition: editionPDA,
          metadata: metadataPDA,
          updateAuthority: addressPubKey,
          mint: mintKeypair.publicKey,
          mintAuthority: addressPubKey,
          maxSupply: maxSupply || maxSupply === 0 ? new BN(maxSupply) : null,
        },
      );
      console.log(masterEditionTx);
      

      const tx = new Transaction().add(
        createMintTx,
        createMetadataTx,
        createAssociatedTokenAccountTx,
        mintToTx,
        masterEditionTx,
      );
      console.log('a', tx);
    

      const blockHash = (await connection.getLatestBlockhash('finalized'))
        .blockhash;
      tx.feePayer = addressPubKey;
      tx.recentBlockhash = blockHash;
      // tx.partialSign(mintKeypair);
      // tx.sign(mintKeypair);
    

      const transactionBuffer = tx.serializeMessage();
      const signature = sign.detached(transactionBuffer, mintKeypair.secretKey);
      tx.addSignature(mintKeypair.publicKey, Buffer.from(signature));
      console.log(tx.signatures[0].publicKey.toBase58());
      console.log(tx.signatures[1].publicKey.toBase58());
      
      console.log('b', tx);
      return bs58.encode(transactionBuffer);

      // const nftCreationEvent = new NftCreationEvent(nft.mint.toString(), createParams.network, createParams.userId);
      // this.eventEmitter.emit('nft.created', nftCreationEvent);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
