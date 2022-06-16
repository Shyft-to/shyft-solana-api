import { Module } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { CreateNftController } from './components/create-nft/create-nft.controller';
import { CreateNftService } from './components/create-nft/create-nft.service';
import { ReadNftController } from './components/read-nft/read-nft.controller';
import { ReadNftService } from './components/read-nft/read-nft.service';
import { BurnNftController } from './components/burn-nft/burn-nft.controller';
import { BurnNftService } from './components/burn-nft/burn-nft.service';
import { UpdateNftController } from './components/update-nft/update-nft.controller';
import { UpdateNftService } from './components/update-nft/update-nft.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/dal/user.schema';
import { StorageMetadataController } from './components/storage-metadata/storage-metadata.controller';
import { StorageMetadataService } from './components/storage-metadata/storage-metadata.service';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RemoteDataFetcherService } from './components/remote-data-fetcher/data-fetcher.service';

@Module({
  controllers: [
    CreateNftController,
    ReadNftController,
    BurnNftController,
    UpdateNftController,
    StorageMetadataController,
  ],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule,
    EventEmitterModule.forRoot()
  ],
  providers: [
    CreateNftService,
    AccountService,
    ReadNftService,
    BurnNftService,
    UpdateNftService,
    StorageMetadataService,
    RemoteDataFetcherService,
  ],
})
export class NftModule { }
