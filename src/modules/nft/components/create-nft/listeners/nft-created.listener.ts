import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { NftMetaData, NftMetaDataDocument } from 'src/schemas/nft.metadata.schema';
import { NftCreationEvent } from '../events/nft-creation.event';

@Injectable()
export class NftCreatedListener {
    constructor(@InjectModel(NftMetaData.name) private nftMetaDataModel: Model<NftMetaDataDocument>) { }

    @OnEvent('nft.created')
    handleOrderCreatedEvent(event: NftCreationEvent) {
        //console.log(event.createNftDto.attributes);
        let datum = new NftMetaData()
        datum.email = event.user
        datum.name = event.createNftDto.name
        datum.symbol = event.createNftDto.symbol
        datum.description = event.createNftDto.description
        datum.share = event.createNftDto.share
        datum.externalUrl = event.createNftDto.externalUrl
        datum.sellerFeeBasisPoints = event.createNftDto.sellerFeeBasisPoints
        datum.assetCid = event.uploadedImageData.cid
        datum.assetUri = event.uploadedImageData.uri
        datum.attributesUri = event.metaDataUri
        datum.txId = event.nft.txId
        datum.mint = event.nft.mint.toString()
        datum.metadata = event.nft.metadata.toString()
        datum.edition = event.nft.edition.toString()
        datum.attributes = event.createNftDto.attributes

        this.nftMetaDataModel.create(datum)
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }
}