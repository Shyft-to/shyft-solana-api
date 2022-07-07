import { HttpModule } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NftInfo } from 'dist/dal/nft-repo/nft-info.schema';
import { Model } from 'mongoose';
import { NftInfoAccessor } from 'src/dal/nft-repo/nft-info.accessor';
import { RemoteDataFetcherService } from 'src/modules/db/remote-data-fetcher/data-fetcher.service';
import { ReadNftController } from './read-nft.controller';
import { ReadNftService } from './read-nft.service';

describe('ReadNftController', () => {
  let controller: ReadNftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ReadNftController],
      providers: [
        {
          provide: getModelToken(NftInfo.name),
          useValue: Model, // <-- Use the Model Class from Mongoose
        },
        ReadNftService,
        RemoteDataFetcherService,
        NftInfoAccessor,
        EventEmitter2,
      ],
    }).compile();

    controller = module.get<ReadNftController>(ReadNftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
