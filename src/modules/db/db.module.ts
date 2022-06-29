import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NftInfoAccessor } from 'src/dal/nft-repo/nft-info.accessor';
import { NftInfo, NftInfoSchema } from 'src/dal/nft-repo/nft-info.schema';
import { RemoteDataFetcherService } from './remote-data-fetcher/data-fetcher.service';
import { DbSyncService } from './db-sync/db-sync.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: NftInfo.name, schema: NftInfoSchema }]), HttpModule, EventEmitterModule.forRoot()],
  providers: [NftInfoAccessor, DbSyncService, RemoteDataFetcherService],
  exports: [NftInfoAccessor, DbSyncService, RemoteDataFetcherService],
})
export class DbModule {}
