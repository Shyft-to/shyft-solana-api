import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/modules/account/account.service';
import { BurnNftService } from './burn-nft.service';

describe('BurnNftService', () => {
  let service: BurnNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BurnNftService, AccountService, EventEmitter2],
    }).compile();

    service = module.get<BurnNftService>(BurnNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
