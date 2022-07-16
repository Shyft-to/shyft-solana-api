import { Test, TestingModule } from '@nestjs/testing';
import { GetTokenService } from './get-token.service';

describe('MintTokenService', () => {
  let service: GetTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetTokenService],
    }).compile();

    service = module.get<GetTokenService>(GetTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
