import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getMint, getAssociatedTokenAddress, createMintToCheckedInstruction, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey, Transaction } from '@solana/web3.js';
import { MintTokenDto } from './dto/mint-token.dto';

@Injectable()
export class MintTokenService {
  async mintToken(mintTokenDto: MintTokenDto): Promise<any> {
    try {
      const {
        network,
        address,
        token_address: token_address,
        amount,
      } = mintTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const tokenAddressPubkey = new PublicKey(token_address);
      const tokenInfo = await getMint(connection, tokenAddressPubkey);
      const addressPubkey = new PublicKey(address);

      if (tokenInfo.isInitialized) {
        if (tokenInfo.mintAuthority.toBase58() !== address) {
          throw Error('You dont have the authority to mint these tokens');
        }
        const associatedTokenAddress = await getAssociatedTokenAddress(
          tokenAddressPubkey,
          addressPubkey,
        );
        const decimalAmount = Math.pow(10, tokenInfo.decimals);

        const tx = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            addressPubkey,
            associatedTokenAddress,
            addressPubkey,
            tokenAddressPubkey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          ),
          createMintToCheckedInstruction(
            tokenAddressPubkey, // mint
            associatedTokenAddress, // destination
            addressPubkey, // authority
            decimalAmount * amount, // amount
            tokenInfo.decimals, // decimals
          ),
        );

        const blockHash = (await connection.getLatestBlockhash('finalized')).blockhash;
        tx.recentBlockhash = blockHash;
        tx.feePayer = addressPubkey;

        const serializedTransaction = tx.serialize({ requireAllSignatures: false });
        const transactionBase64 = serializedTransaction.toString('base64');

        return transactionBase64;
      } else {
        throw Error('Token not initialized');
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
