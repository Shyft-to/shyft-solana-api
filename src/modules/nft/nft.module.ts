import { Module } from '@nestjs/common';
import { WalletService } from '../account/account.service';
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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DbModule } from '../db/db.module';
import { SearchNftcontroller } from './components/search-nft/search-nft.controller';
import { SearchNftService } from './components/search-nft/search-nft.service';
import { TransferNftService } from './components/transfer-nft/transfer-nft.service';
import { TransferNftController } from './components/transfer-nft/transfer-nft.controller';

@Module({
  controllers: [CreateNftController, ReadNftController, BurnNftController, UpdateNftController, StorageMetadataController, SearchNftcontroller, TransferNftController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), EventEmitterModule.forRoot(), DbModule],
  providers: [CreateNftService, WalletService, ReadNftService, BurnNftService, UpdateNftService, StorageMetadataService, SearchNftService, TransferNftService],
})
export class NftModule { }
