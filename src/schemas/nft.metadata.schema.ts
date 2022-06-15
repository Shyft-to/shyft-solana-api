import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NftMetaDataDocument = NftMetaData & Document

@Schema()
export class NftMetaData {
    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    symbol: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    share: number

    @Prop({ required: false })
    externalUrl: string

    @Prop({ required: false })
    sellerFeeBasisPoints: number

    @Prop({ required: false })
    assetCid: string

    @Prop({ required: true })
    assetUri: string

    @Prop({ required: true })
    attributesUri: string

    @Prop({ required: true })
    txId: string

    @Prop({ required: true })
    mint: string

    @Prop({ required: true })
    metadata: string

    @Prop({ required: true })
    edition: string

    @Prop({ required: false, type: Object })
    attributes: Object
}

export const NftMetaDataSchema = SchemaFactory.createForClass(NftMetaData);