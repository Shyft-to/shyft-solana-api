import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { BalanceCheckDto } from './dto/balance-check.dto';
import { SendSolDto } from './dto/send-sol.dto';
import { AccountUtils } from 'src/common/utils/account-utils';

@Injectable()
export class AccountService {

  async checkBalance(balanceCheckDto: BalanceCheckDto): Promise<number> {
    try {
      const { address, network } = balanceCheckDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const balance = await connection.getBalance(new PublicKey(address));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendSol(sendSolDto: SendSolDto): Promise<string> {
    try {
      const { network, from_private_key, to_address, amount } = sendSolDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');

      const from = AccountUtils.getKeypair(from_private_key);
      // Add transfer instruction to transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: new PublicKey(to_address),
          lamports: LAMPORTS_PER_SOL * amount,
        }),
      );

      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
      return signature;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
