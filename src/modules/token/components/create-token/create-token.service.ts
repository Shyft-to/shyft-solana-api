import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { createCreateMetadataAccountV2Instruction, DataV2 } from '@metaplex-foundation/mpl-token-metadata';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from '@solana/web3.js';
import { findMetadataPda } from '@metaplex-foundation/js';
import { CreateTokenDto } from './dto/create-token.dto';
import { NodeWallet } from '@metaplex/js';
import { AccountUtils } from 'src/common/utils/account-utils';

@Injectable()
export class CreateTokenService {
  async createToken(createTokenDto: CreateTokenDto, uri: string): Promise<any> {
    try {
      const {
        network,
        private_key,
        name,
        symbol,
        mint_authority,
        freeze_authority,
        decimals,
      } = createTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const feePayer = AccountUtils.getKeypair(private_key);
      const wallet = new NodeWallet(feePayer);

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const metadataPDA = findMetadataPda(mintKeypair.publicKey);

      const tokenMetadata = {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: feePayer.publicKey,
            verified: true,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      } as DataV2;

      const mintAuthority = mint_authority ? new PublicKey(mint_authority) : feePayer.publicKey;
      const freezeAuthority = freeze_authority ? new PublicKey(freeze_authority) : feePayer.publicKey;

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: feePayer.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals ?? 9, // decimals
          mintAuthority,
          freezeAuthority,
          TOKEN_PROGRAM_ID,
        ),
        createCreateMetadataAccountV2Instruction(
          {
            metadata: metadataPDA,
            mint: mintKeypair.publicKey,
            mintAuthority: feePayer.publicKey,
            payer: feePayer.publicKey,
            updateAuthority: feePayer.publicKey,
          },
          {
            createMetadataAccountArgsV2: {
              data: tokenMetadata,
              isMutable: true,
            },
          },
        ),
      );

      const blockHash = (await connection.getLatestBlockhash('finalized')).blockhash;
      createNewTokenTransaction.recentBlockhash = blockHash;
      createNewTokenTransaction.feePayer = feePayer.publicKey;
      createNewTokenTransaction.partialSign(mintKeypair);

      const signedTx = await wallet.signTransaction(createNewTokenTransaction);
      const txhash = await connection.sendRawTransaction(signedTx.serialize());

      return { txhash, token_address: mintKeypair.publicKey.toBase58() };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
