import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { SendSolDetachDto } from './dto/send-sol-detach.dto';

@Injectable()
export class SendSolDetachService {
  async sendSol(sendSolDetachDto: SendSolDetachDto): Promise<any> {
    try {
      const { network, from_address, to_address, amount } = sendSolDetachDto;

      const fromAddressPubKey = new PublicKey(from_address);
      const toAddressPubkey = new PublicKey(to_address);

      const connection = new Connection(clusterApiUrl(network), 'confirmed');

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromAddressPubKey,
          toPubkey: toAddressPubkey,
          lamports: LAMPORTS_PER_SOL * amount,
        }),
      );

      const blockHash = (await connection.getLatestBlockhash('finalized'))
        .blockhash;
      tx.feePayer = fromAddressPubKey;
      tx.recentBlockhash = blockHash;

      const serializedTransaction = tx.serialize({ requireAllSignatures: false });
      const transactionBase64 = serializedTransaction.toString('base64');
      return transactionBase64;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
