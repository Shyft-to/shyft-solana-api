import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { NftInfoAccessor } from 'src/dal/nft-repo/nft-info.accessor';
import { RemoteDataFetcherService } from 'src/modules/db/remote-data-fetcher/data-fetcher.service';
import { ReadNftService } from './read-nft.service';
import { Model } from 'mongoose';
import { NftInfo } from 'src/dal/nft-repo/nft-info.schema';

describe('ReadNftService', () => {
  let service: ReadNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: getModelToken(NftInfo.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
        ReadNftService,
        EventEmitter2,
        RemoteDataFetcherService,
        NftInfoAccessor,
      ],
    }).compile();

    service = module.get<ReadNftService>(ReadNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
