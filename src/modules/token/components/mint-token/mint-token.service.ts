import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mintToChecked, getOrCreateAssociatedTokenAccount, getMint } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { AccountUtils } from 'src/common/utils/account-utils';
import { MintTokenDto } from './dto/mint-token.dto';

@Injectable()
export class MintTokenService {
  async mintToken(mintTokenDto: MintTokenDto): Promise<any> {
    try {
      const {
        network,
        private_key,
        token_address: token_address,
        amount,
        receiver,
      } = mintTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const feePayer = AccountUtils.getKeypair(private_key);

      const tokenAddressPubkey = new PublicKey(token_address);
      const tokenInfo = await getMint(connection, tokenAddressPubkey);

      if (tokenInfo.isInitialized) {
        if (tokenInfo.mintAuthority.toBase58() !== feePayer.publicKey.toBase58()) {
          throw Error('You dont have the authority to mint these tokens');
        }
        //Get or Create an associated token address for receiver.
        const tokenAccountOwner = await getOrCreateAssociatedTokenAccount(
          connection,
          feePayer,
          new PublicKey(token_address),
          new PublicKey(receiver),
        );

        const decimalAmount = Math.pow(10, tokenInfo.decimals);

        const txhash = await mintToChecked(
          connection, // connection
          feePayer, // fee payer
          tokenAddressPubkey, // mint
          tokenAccountOwner.address, // receiver (sholud be a token account)
          feePayer, // mint authority
          decimalAmount * amount,
          tokenInfo.decimals, // decimals
        );

        return { txhash };
      } else {
        throw Error('Token not initialized');
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
