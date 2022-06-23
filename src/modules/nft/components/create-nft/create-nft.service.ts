import { Injectable } from '@nestjs/common';
import { clusterApiUrl } from '@solana/web3.js';
import { actions, Connection, NodeWallet } from '@metaplex/js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccountService } from 'src/modules/account/account.service';
import { MintNftDto } from './dto/mint-nft-dto';
import { NftCreationEvent } from '../db-sync/events';

@Injectable()
export class CreateNftService {
  constructor(private accountService: AccountService, private eventEmitter: EventEmitter2) {}

  async mintNft(mintNftDto: MintNftDto): Promise<any> {
    const { metadata_uri, max_supply, network, private_key } = mintNftDto;
    if (!metadata_uri) {
      throw new Error('No metadata URI');
    }
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const from = this.accountService.getKeypair(private_key);
    const wallet = new NodeWallet(from);
    const nft = await actions.mintNFT({
      connection,
      wallet,
      uri: metadata_uri,
      maxSupply: max_supply || 1,
    });

    const nftCreationEvent = new NftCreationEvent(nft.mint.toString(), mintNftDto.network, mintNftDto.userId);
    this.eventEmitter.emit('nft.created', nftCreationEvent);

    return nft;
  }
}
