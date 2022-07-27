import { NodeWallet } from '@metaplex/js';
import { Injectable } from '@nestjs/common';
import { clusterApiUrl, Connection, Keypair, Transaction } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { SignTransactionDto } from './dto/sign-transaction.dto';

@Injectable()
export class SignTransactionService {
  async signTransaction(signTransactionDto: SignTransactionDto): Promise<any> {
    const { network, private_key, encoded_transaction } = signTransactionDto;
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const feePayer = Keypair.fromSecretKey(bs58.decode(private_key));
    const wallet = new NodeWallet(feePayer);
    // const transactionBuffer = bs58.decode(encoded_transaction);
    const recoveredTransaction = Transaction.from(
      Buffer.from(encoded_transaction, 'base64'),
    );
    // delete recoveredTransaction.signatures;
    console.log(recoveredTransaction);

    const signedTx = await wallet.signTransaction(recoveredTransaction);
    // const transaction = Transaction.populate(Message.from(transactionBuffer));
    const confirmTransaction = await connection.sendRawTransaction(signedTx.serialize());
    return confirmTransaction;
  }
}
