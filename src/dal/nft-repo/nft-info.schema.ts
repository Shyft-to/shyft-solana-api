/*
1. schema for the nft document
2. functions to read, write and update these documents. These functions will be called from the service layers
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type NftInfoDocument = NftInfo & Document;

interface creator {
  address: string;
  verified: boolean;
  share: number;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class NftInfo {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  api_key_id: ObjectId;

  @Prop({ required: true })
  chain: string;

  @Prop({ required: true })
  update_authority: string;

  @Prop({ required: true })
  mint: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  primary_sale_happened: boolean;

  @Prop({ required: true })
  is_mutable: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  external_url: string;

  @Prop({ required: false })
  seller_fee_basis_points: number;

  @Prop({ required: true })
  image_uri: string;

  @Prop({ required: true })
  metadata_uri: string;

  @Prop({ required: false, type: Object })
  attributes: object;

  @Prop({ required: true })
  creators: creator[];
}

export const NftInfoSchema = SchemaFactory.createForClass(NftInfo);
