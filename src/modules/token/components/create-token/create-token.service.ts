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
} from '@solana/web3.js';
import { findMetadataPda } from '@metaplex-foundation/js';
import { AccountService } from 'src/modules/account/account.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { actions, NodeWallet } from '@metaplex/js';

@Injectable()
export class CreateTokenService {
  constructor(private accountService: AccountService) {}
  async createToken(createTokenDto: CreateTokenDto, uri: string): Promise<any> {
    try {
      const { network, private_key, name, symbol } = createTokenDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const feePayer = this.accountService.getKeypair(private_key);
      const wallet = new NodeWallet(feePayer);

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const metadataPDA = findMetadataPda(mintKeypair.publicKey);
      const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        feePayer.publicKey,
      );

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
          9, // decimals
          feePayer.publicKey,
          feePayer.publicKey,
          TOKEN_PROGRAM_ID,
        ),
        createAssociatedTokenAccountInstruction(
          feePayer.publicKey,
          tokenATA,
          feePayer.publicKey,
          mintKeypair.publicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
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

      const signedTx = await wallet.signTransaction(createNewTokenTransaction);
      const txhash = await connection.sendRawTransaction(signedTx.serialize());

      return { txhash, mint_token_address: mintKeypair.publicKey.toBase58() };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
