import { Injectable } from '@nestjs/common';
import { clusterApiUrl } from '@solana/web3.js';
import { actions, Connection, NodeWallet } from '@metaplex/js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AccountService } from 'src/modules/account/account.service';
import { NftCreationEvent } from '../../../db/db-sync/db.events';
import { Network } from 'src/dto/netwotk.dto';
import { ObjectId } from 'mongoose';

export interface CreateParams {
  network: Network;
  privateKey: string;
  metadataUri: string;
  maxSupply: number;
  userId: ObjectId;
}

@Injectable()
export class CreateNftService {
  constructor(private accountService: AccountService, private eventEmitter: EventEmitter2) {}

  async mintNft(createParams: CreateParams): Promise<unknown> {
    const { metadataUri: metadataUri, maxSupply: maxSupply, network, privateKey: privateKey } = createParams;
    if (!metadataUri) {
      throw new Error('No metadata URI');
    }
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const from = this.accountService.getKeypair(privateKey);
    const wallet = new NodeWallet(from);
    const nft = await actions.mintNFT({
      connection,
      wallet,
      uri: metadataUri,
      maxSupply: maxSupply || 1,
    });

    const nftCreationEvent = new NftCreationEvent(nft.mint.toString(), createParams.network, createParams.userId);
    this.eventEmitter.emit('nft.created', nftCreationEvent);

    return nft;
  }
}
