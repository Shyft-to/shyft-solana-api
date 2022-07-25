import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/modules/account/account.service';
import { CreateTokenService } from './create-token.service';

describe('CreateTokenService', () => {
  let service: CreateTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTokenService, AccountService],
    }).compile();

    service = module.get<CreateTokenService>(CreateTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
