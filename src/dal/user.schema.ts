import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  api_key: string;

  id: ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
