import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/modules/account/account.service';
import { BurnNftController } from './burn-nft.controller';
import { BurnNftService } from './burn-nft.service';

describe('BurnNftController', () => {
  let controller: BurnNftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BurnNftController],
      providers: [BurnNftService, AccountService, EventEmitter2],
    }).compile();

    controller = module.get<BurnNftController>(BurnNftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
