import { HttpException, Injectable } from '@nestjs/common';
import { clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { Connection, NodeWallet } from '@metaplex/js';
import { AccountUtils } from 'src/common/utils/account-utils';
import { TransferNftDto } from './dto/transfer.dto';
import {
  createTransferCheckedInstruction,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { UpdateNftService } from '../update-nft/update-nft.service';
import { Metaplex } from '@metaplex-foundation/js';

@Injectable()
export class TransferNftService {
  constructor(private updateNftService: UpdateNftService) {}

  async transferNft(transferNftDto: TransferNftDto): Promise<any> {
    const {
      network,
      from_address: fromAdress,
      transfer_authority,
    } = transferNftDto;
    const tokenAddress = new PublicKey(transferNftDto.token_address);
    const toAddress = new PublicKey(transferNftDto.to_address);

    const connection = new Connection(clusterApiUrl(network), 'confirmed');

    //generate wallet
    const fromKeypair = AccountUtils.getKeypair(fromAdress);
    const wallet = new NodeWallet(fromKeypair);

    //Find token accounts
    const fromAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      tokenAddress,
      fromKeypair.publicKey,
    );
    const toAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      tokenAddress,
      toAddress,
    );

    //Create transfer instruction
    const ix = createTransferCheckedInstruction(
      fromAccount.address,
      tokenAddress,
      toAccount.address,
      fromKeypair.publicKey,
      1,
      0,
    );
    const tx = new Transaction().add(ix);
    tx.feePayer = fromKeypair.publicKey;
    tx.recentBlockhash = (
      await connection.getLatestBlockhash('finalized')
    ).blockhash;

    //Sign and send it
    const signedTx = await wallet.signTransaction(tx);
    const transferTxId = await connection.sendRawTransaction(
      signedTx.serialize(),
    );

    const isSuccessful = await connection.confirmTransaction(transferTxId);

    //Now update the authority
    let updateTxId;
    if (isSuccessful.value.err === null && transfer_authority) {
      //Update Authority
      const metaplex = Metaplex.make(connection);
      const nft = await metaplex.nfts().findByMint(tokenAddress);
      updateTxId = await this.updateNftService.updateNft(nft.uri, {
        is_mutable: nft.isMutable,
        name: nft.name,
        network,
        primary_sale_happened: nft.primarySaleHappened,
        royalty: nft.sellerFeeBasisPoints,
        symbol: nft.symbol,
        token_address: nft.mint.toBase58(),
        update_authority: nft.updateAuthority.toBase58(),
        new_update_authority: toAddress.toBase58(),
        private_key: fromAdress,
      });
    }
    return { updateTxId: updateTxId?.txId ?? 'update_authority not transfered', transferTxId: transferTxId };
  }
  catch(error) {
    console.log(error);
    throw new HttpException(error.message || error, error.status);
  }
}
