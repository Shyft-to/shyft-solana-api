import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
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

@Injectable()
export class CreateTokenService {
  async createToken(createTokenDto: CreateTokenDto, uri: string): Promise<any> {
    try {
      const { network, address, name, symbol, decimals } = createTokenDto;

      const connection = new Connection(clusterApiUrl(network), 'confirmed');

      const addressPubKey = new PublicKey(address);
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
            address: addressPubKey,
            verified: true,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      } as DataV2;

      const mintAuthority = addressPubKey;
      const freezeAuthority = addressPubKey;

      const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: addressPubKey,
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
            mintAuthority,
            payer: addressPubKey,
            updateAuthority: mintAuthority,
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
      createNewTokenTransaction.feePayer = addressPubKey;
      createNewTokenTransaction.partialSign(mintKeypair);

      const serializedTransaction = createNewTokenTransaction.serialize({ requireAllSignatures: false, verifySignatures: false });
      const transactionBase64 = serializedTransaction.toString('base64');

      return { enoded_transaction: transactionBase64, mint: mintKeypair.publicKey.toBase58() };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
