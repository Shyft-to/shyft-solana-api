import { NodeWallet } from '@metaplex/js';
import { Injectable } from '@nestjs/common';
import { clusterApiUrl, Connection, Transaction } from '@solana/web3.js';
import { AccountUtils } from 'src/common/utils/account-utils';
import { SignTransactionDto } from './dto/sign-transaction.dto';

@Injectable()
export class SignTransactionService {
  async signTransaction(signTransactionDto: SignTransactionDto): Promise<any> {
    const { network, private_key, encoded_transaction } = signTransactionDto;
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const feePayer = AccountUtils.getKeypair(private_key);
    const wallet = new NodeWallet(feePayer);
    const recoveredTransaction = Transaction.from(
      Buffer.from(encoded_transaction, 'base64'),
    );
    const signedTx = await wallet.signTransaction(recoveredTransaction);
    const confirmTransaction = await connection.sendRawTransaction(signedTx.serialize());
    return confirmTransaction;
  }
}
