import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/modules/account/account.service';
import { CreateNftService } from './create-nft.service';

describe('CreateNftService', () => {
  let service: CreateNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateNftService, AccountService, EventEmitter2],
    }).compile();

    service = module.get<CreateNftService>(CreateNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
