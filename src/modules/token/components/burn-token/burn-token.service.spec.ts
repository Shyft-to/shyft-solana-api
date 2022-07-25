import { Test, TestingModule } from '@nestjs/testing';
import { BurnTokenService } from './burn-token.service';
import { AccountService } from 'src/modules/account/account.service';

describe('BurnTokenService', () => {
  let service: BurnTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BurnTokenService, AccountService],
    }).compile();

    service = module.get<BurnTokenService>(BurnTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
