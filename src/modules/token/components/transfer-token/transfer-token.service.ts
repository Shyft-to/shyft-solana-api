import { walletAdapterIdentity } from '@metaplex-foundation/js';
import { NodeWallet } from '@metaplex/js';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  getOrCreateAssociatedTokenAccount,
  getMint,
  createTransferCheckedInstruction,
} from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AccountUtils } from 'src/common/utils/account-utils';
import { TransferTokenDto } from './dto/transfer-token.dto';

@Injectable()
export class TransferTokenService {
  async transferToken(mintTokenDto: TransferTokenDto): Promise<any> {
    try {
      const {
        network,
        from_address,
        token_address: token_address,
        amount,
        to_address,
      } = mintTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const fromKeypair = AccountUtils.getKeypair(from_address);

      const tokenAddressPubkey = new PublicKey(token_address);
      const tokenInfo = await getMint(connection, tokenAddressPubkey);

      if (tokenInfo.isInitialized) {
        //Get or Create an associated token address for receiver.
        const fromAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          fromKeypair,
          new PublicKey(token_address),
          fromKeypair.publicKey,
        );

        const toAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          fromKeypair,
          new PublicKey(token_address),
          new PublicKey(to_address),
        );

        const amtToTransfer = Math.pow(10, tokenInfo.decimals) * amount;
        const wallet = new NodeWallet(fromKeypair);

        const ix = createTransferCheckedInstruction(
          fromAccount.address,
          new PublicKey(token_address),
          toAccount.address,
          fromKeypair.publicKey,
          amtToTransfer,
          tokenInfo.decimals,
        );

        const tx = new Transaction().add(ix);
        tx.feePayer = fromKeypair.publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
        const signedTx = await wallet.signTransaction(tx);
        const txId = await connection.sendRawTransaction((await signedTx).serialize());

        return { txId };
      } else {
        throw Error('Token not initialized');
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
