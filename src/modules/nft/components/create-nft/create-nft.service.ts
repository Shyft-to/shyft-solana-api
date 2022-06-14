import { Injectable } from '@nestjs/common';
import { clusterApiUrl } from '@solana/web3.js';

import { actions, Connection, NodeWallet } from '@metaplex/js';
import { Blob, NFTStorage } from 'nft.storage';
import { snakeCase } from 'lodash';
import { CreateNftDto } from './dto/create-nft.dto';
import { AccountService } from 'src/modules/account/account.service';
import { MintNFTResponse } from '@metaplex/js/lib/actions';
import { NftCreationEvent } from './events/nft-creation.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

const storageClient = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZGMUMyQ0IxY2M4ZUI2OWE1MDVEZDM5YjU1NGUwQUM0RkJCMWY2QjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MjM4Mzk3OTUyNywibmFtZSI6InNoeWZ0In0.Yu2UPw5UBCsddrE4-fdcIp8oPiVy0VjTlSTJgku-EUw',
});

export interface IpfsUploadResponse {
  cid: string;
  uri: string;
}

@Injectable()
export class CreateNftService {
  constructor(private accountService: AccountService, private eventEmitter: EventEmitter2) { }
  async prepareMetaData(
    createNftDto: CreateNftDto,
    image: string,
  ): Promise<any> {
    const {
      privateKey,
      name,
      description,
      symbol,
      attributes,
      share,
      sellerFeeBasisPoints,
      externalUrl,
    } = createNftDto;
    const accountInfo = await this.accountService.getKeypair(privateKey);
    const address = accountInfo.publicKey.toBase58();

    const attributesArray = attributes.map((attribute) => {
      const camelCaseObj = {};
      for (const key of Object.keys(attribute)) {
        if (Object.prototype.hasOwnProperty.call(attribute, key)) {
          camelCaseObj[snakeCase(key)] = attribute[key];
        }
      }
      return camelCaseObj;
    });
    const metadata = JSON.stringify({
      name,
      symbol,
      description,
      seller_fee_basis_points: sellerFeeBasisPoints ? sellerFeeBasisPoints : 0,
      external_url: externalUrl ? externalUrl : '',
      image,
      attributes: attributesArray,
      properties: {
        creators: [{ address, verified: true, share }],
      },
    });

    const uploadResponse = await this.uploadToIPFS(
      new Blob([metadata], { type: 'application/json' }),
    );
    return uploadResponse.uri;
  }

  async uploadToIPFS(file: Blob): Promise<IpfsUploadResponse> {
    const ipfstx = await storageClient.storeBlob(file);
    return { cid: ipfstx, uri: `https://ipfs.io/ipfs/${ipfstx}` };
  }

  async mintNft(createNftDto: CreateNftDto, metaDataURI: string): Promise<any> {
    if (!metaDataURI) {
      throw new Error('No metadata URI');
    }
    const { network, privateKey } = createNftDto;
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const from = this.accountService.getKeypair(privateKey);
    const wallet = new NodeWallet(from);
    const nft = await actions.mintNFT({
      connection,
      wallet,
      uri: metaDataURI,
      maxSupply: 1,
    });
    return nft;
  }

  updateNftInDb(createNftDto: CreateNftDto, metaDataURI: string, uploadedImageDetails: IpfsUploadResponse, nft: MintNFTResponse) {

    let nftCreationEvent = new NftCreationEvent()
    nftCreationEvent.createNftDto = createNftDto
    nftCreationEvent.metaDataUri = metaDataURI
    nftCreationEvent.uploadedImageData = uploadedImageDetails
    nftCreationEvent.nft = nft
    this.eventEmitter.emit(
      'nft.created', nftCreationEvent
    );
  }
}
