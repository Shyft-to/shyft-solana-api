import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { Connection, NodeWallet, transactions } from '@metaplex/js';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { NftCreationEvent } from '../../../db/db-sync/db.events';
import { Network } from 'src/dto/netwotk.dto';
import { ObjectId } from 'mongoose';
import { sign } from 'tweetnacl';
import * as beet from '@metaplex-foundation/beet'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { findAssociatedTokenAccountPda, findMasterEditionV2Pda, findMetadataPda, TransactionBuilder } from '@metaplex-foundation/js';
import * as bs58 from 'bs58';
import {
  CreateMasterEdition,
  CreateMasterEditionArgs,
  CreateMetadata,
  Creator,
  MasterEdition,
  MetadataDataData,
} from '@metaplex-foundation/mpl-token-metadata-depricated';
import * as BN from 'bn.js';
import { createCreateMasterEditionV3Instruction, createCreateMetadataAccountV2Instruction, DataV2 } from '@metaplex-foundation/mpl-token-metadata';
import { AccountUtils } from 'src/common/utils/account-utils';
export interface CreateParams {
  network: Network;
  name: string;
  symbol: string;
  address: string;
  metadataUri: string;
  maxSupply: number;
  royalty: number;
  userId: ObjectId;
}

@Injectable()
export class CreateNftService {
  constructor(private eventEmitter: EventEmitter2) {}

  async mintNft(createParams: CreateParams): Promise<unknown> {
    const { name, symbol, metadataUri, maxSupply, royalty, network, address } =
      createParams;
    if (!metadataUri) {
      throw new Error('No metadata URI');
    }
    try {
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      const mintRent = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const feePayer = AccountUtils.getKeypair('5GGZQpoiDHuWwt3GmwVGZPRJLwMonq4ozgMXyiQ5grbPzgF3k35dkBXywXvBBKbxvNq76L3teJcJ53Emsda92D5v');
      const wallet = new NodeWallet(feePayer);
      const metadataPda = findMetadataPda(mintKeypair.publicKey);
      const masterEditionPda = findMasterEditionV2Pda(mintKeypair.publicKey);
      console.log('masterEditionPda', masterEditionPda);
      console.log('........................');
      const editionPDA = await MasterEdition.getPDA(mintKeypair.publicKey);
      console.log('editionPDA', editionPDA);

      const addressPubKey = new PublicKey(address);
      const associatedToken = findAssociatedTokenAccountPda(
        mintKeypair.publicKey,
        addressPubKey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const nftMetadata = {
        name,
        symbol,
        uri: metadataUri,
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

      // const createMintTx = new transactions.CreateMint(
      //   { feePayer: addressPubKey },
      //   {
      //     newAccountPubkey: mintKeypair.publicKey,
      //     lamports: mintRent,
      //   },
      // );
      // console.log(createMintTx);

      // const createMetadataTx = new CreateMetadata(
      //   {
      //     feePayer: addressPubKey,
      //   },
      //   {
      //     metadata: metadataPDA,
      //     metadataData,
      //     updateAuthority: addressPubKey,
      //     mint: mintKeypair.publicKey,
      //     mintAuthority: addressPubKey,
      //   },
      // );
      // console.log(createMetadataTx);

      // const recipient = await getAssociatedTokenAddress(
      //   mintKeypair.publicKey,
      //   addressPubKey,
      //   false,
      //   TOKEN_PROGRAM_ID,
      //   ASSOCIATED_TOKEN_PROGRAM_ID,
      // );

      // const createAssociatedTokenAccountTx =
      //   new transactions.CreateAssociatedTokenAccount(
      //     { feePayer: addressPubKey },
      //     {
      //       associatedTokenAddress: recipient,
      //       splTokenMintAddress: mintKeypair.publicKey,
      //     },
      //   );
      //   console.log(createAssociatedTokenAccountTx);

      // const mintToTx = new transactions.MintTo(
      //   { feePayer: addressPubKey },
      //   {
      //     mint: mintKeypair.publicKey,
      //     dest: recipient,
      //     amount: 1,
      //   },
      // );
      // console.log(mintToTx);
      

      // const masterEditionTx = new CreateMasterEdition(
      //   { feePayer: addressPubKey },
      //   {
      //     edition: editionPDA,
      //     metadata: metadataPDA,
      //     updateAuthority: addressPubKey,
      //     mint: mintKeypair.publicKey,
      //     mintAuthority: addressPubKey,
      //     maxSupply: maxSupply || maxSupply === 0 ? new BN(maxSupply) : null,
      //   },
      // );
      // console.log(masterEditionTx);
      

      // const tx = new Transaction().add(
      //   createMintTx,
      //   createMetadataTx,
      //   createAssociatedTokenAccountTx,
      //   mintToTx,
      //   masterEditionTx,
      // );
      // console.log('a', tx);

      const tx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: addressPubKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: mintRent,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          0,
          addressPubKey,
          addressPubKey,
          TOKEN_PROGRAM_ID,
        ),
        createAssociatedTokenAccountInstruction(
          addressPubKey,
          associatedToken,
          addressPubKey,
          mintKeypair.publicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          addressPubKey,
          mintRent,
        ),
        createCreateMetadataAccountV2Instruction(
          {
            metadata: metadataPda,
            mint: mintKeypair.publicKey,
            mintAuthority: addressPubKey,
            payer: addressPubKey,
            updateAuthority: addressPubKey,
          },
          {
            createMetadataAccountArgsV2: { data: nftMetadata, isMutable: true },
          },
        ),
        // createCreateMasterEditionV3Instruction(
        //   {
        //     edition: masterEditionPda,
        //     mint: mintKeypair.publicKey,
        //     updateAuthority: addressPubKey,
        //     mintAuthority: addressPubKey,
        //     payer: addressPubKey,
        //     metadata: metadataPda,
        //   },
        //   { createMasterEditionArgs: { maxSupply: 0 } },
        // ),
      );

      const blockHash = (await connection.getLatestBlockhash('finalized'))
        .blockhash;
      tx.feePayer = addressPubKey;
      tx.recentBlockhash = blockHash;
      tx.partialSign(mintKeypair);
      console.log(tx);


      // const signedTx = await wallet.signTransaction(tx);
      // const txhash = await connection.sendRawTransaction(signedTx.serialize());

      // const confirmTransaction = await sendAndConfirmTransaction(
      //   connection,
      //   tx,
      //   [feePayer],
      // );

      // console.log('b', tx);
      // // const transactionBuffer = tx.serializeMessage();
      // // console.log('c', tx);

      const serializedTransaction = tx.serialize({ requireAllSignatures: false });
      console.log('serializedTransaction', serializedTransaction);
      const transactionBase64 = serializedTransaction.toString('base64');

      const recoveredTransaction = Transaction.from(
        Buffer.from(transactionBase64, 'base64'),
      );
      const signedTx = await wallet.signTransaction(recoveredTransaction);
      console.log(signedTx);
      
      // const txhash = await connection.sendRawTransaction(signedTx.serialize());
      // // const signature = sign.detached(transactionBuffer, mintKeypair.secretKey);
      // // tx.addSignature(mintKeypair.publicKey, Buffer.from(signature));
      // // console.log(tx.signatures[0].publicKey.toBase58());
      // // console.log(tx.signatures[1].publicKey.toBase58());
      // console.log('d', tx);

      return transactionBase64;

      // const nftCreationEvent = new NftCreationEvent(nft.mint.toString(), createParams.network, createParams.userId);
      // this.eventEmitter.emit('nft.created', nftCreationEvent);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
