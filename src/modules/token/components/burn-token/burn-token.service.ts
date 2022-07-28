import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createBurnCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BurnTokenDto } from './dto/burn-token.dto';

@Injectable()
export class BurnTokenService {
  async burnToken(burnTokenDto: BurnTokenDto): Promise<any> {
    try {
      const { network, address, token_address, amount } = burnTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const addressPubkey = new PublicKey(address);

      const tokenAddressPubkey = new PublicKey(token_address);

      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenAddressPubkey,
        addressPubkey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const tokenInfo = await getMint(connection, tokenAddressPubkey);

      const decimalAmt = Math.pow(10, tokenInfo.decimals);

      const tx = new Transaction().add(
        createBurnCheckedInstruction(
          associatedTokenAddress, // token account
          tokenAddressPubkey, // mint
          addressPubkey, // owner of token account
          decimalAmt * amount, // amount,
          tokenInfo.decimals, // decimals
        ),
      );

      const blockHash = (await connection.getLatestBlockhash('finalized'))
        .blockhash;
      tx.feePayer = addressPubkey;
      tx.recentBlockhash = blockHash;

      const serializedTransaction = tx.serialize({ requireAllSignatures: false });
      const transactionBase64 = serializedTransaction.toString('base64');

      return transactionBase64;
    } catch (err) {
      console.error(err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
