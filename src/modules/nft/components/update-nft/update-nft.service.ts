/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Connection, NodeWallet, programs } from '@metaplex/js';
import { UpdateNftDto } from './dto/update.dto';
import { AccountService } from 'src/modules/account/account.service';
import { Creator, Metadata,  } from '@metaplex-foundation/mpl-token-metadata';

@Injectable()
export class UpdateNftService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private accountService: AccountService) {}

  async updateNft(updateNftDto: UpdateNftDto, metaDataUri: string): Promise<any>
  {
    if (!metaDataUri) {
      throw new Error('metadata URI missing');
    }
    try {
      const {
        network,
        tokenAddress,
        name,
        symbol,
        updateAuthority,
        sellerFeeBasisPoints,
        privateKey,
        share,
        isMutable,
        primarySaleHappened,
      } = updateNftDto;
      console.log(updateNftDto)
      const connection = new Connection(clusterApiUrl(network), 'confirmed');

      //generate wallet
      const keypair = this.accountService.getKeypair(privateKey);
      const wallet = new NodeWallet(keypair);
      //get token's PDA (metadata address)
      const pda = await Metadata.getPDA(tokenAddress);
      const creators = new Array<Creator>(new programs.metadata.Creator({
        address: wallet.publicKey.toString(),
        verified:true,
        share:share,
      }))
        const res = new programs.metadata.UpdateMetadataV2({
          recentBlockhash: (await connection.getLatestBlockhash('finalized')).blockhash,
          feePayer: wallet.publicKey
        }, {
          metadata: pda,
          updateAuthority: new PublicKey(updateAuthority),
          metadataData: new programs.metadata.DataV2({
            name: name,
            symbol: symbol,
            uri: metaDataUri,
            sellerFeeBasisPoints: sellerFeeBasisPoints,
            creators: creators,
            uses: null,
            collection: null
          }),
          primarySaleHappened: primarySaleHappened,
          isMutable: isMutable
        });
        console.log(res)
        const signedTransaction = await wallet.signTransaction(res)
        const result = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log(result)
        return {txId:result};
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
} 