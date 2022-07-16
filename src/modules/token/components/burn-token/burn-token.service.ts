import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  burnChecked,
  getMint,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BurnTokenDto } from './dto/burn-token.dto';
import { AccountUtils } from 'src/common/utils/account-utils';

@Injectable()
export class BurnTokenService {
  async burnToken(burnTokenDto: BurnTokenDto): Promise<any> {
    try {
      const { network, private_key, token_address, amount } = burnTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const feePayer = AccountUtils.getKeypair(private_key);

      const tokenAddressPubkey = new PublicKey(token_address);

      const tokenInfo = await getMint(connection, tokenAddressPubkey);

      try {
        const tokenAccountOwner = await PublicKey.findProgramAddress(
          [
            feePayer.publicKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenAddressPubkey.toBuffer(),
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        const decimalAmt = Math.pow(10, tokenInfo.decimals);

        const txhash = await burnChecked(
          connection,
          feePayer,
          tokenAccountOwner[0],
          tokenAddressPubkey,
          feePayer,
          decimalAmt * amount,
          tokenInfo.decimals,
        );
        return { txhash };
      } catch (error) {
        throw error;
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
