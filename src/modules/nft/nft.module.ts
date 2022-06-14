import { Module } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { CreateNftController } from './components/create-nft/create-nft.controller';
import { CreateNftService } from './components/create-nft/create-nft.service';
import { ReadNftController } from './components/read-nft/read-nft.controller';
import { ReadNftService } from './components/read-nft/read-nft.service';
import { BurnNftController } from './components/burn-nft/burn-nft.controller';
import { BurnNftService } from './components/burn-nft/burn-nft.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NftCreatedListener } from './components/create-nft/listeners/nft-created.listener';
import { NftMetaData, NftMetaDataSchema } from 'src/schemas/nft.metadata.schema';

@Module({
  controllers: [CreateNftController, ReadNftController, BurnNftController],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: NftMetaData.name, schema: NftMetaDataSchema }
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [CreateNftService, AccountService, ReadNftService, BurnNftService, NftCreatedListener],
})
export class NftModule { }
