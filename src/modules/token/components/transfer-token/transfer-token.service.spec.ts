import { Test, TestingModule } from '@nestjs/testing';
import { TransferTokenService } from './transfer-token.service';

describe('TransferTokenService', () => {
  let service: TransferTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferTokenService],
    }).compile();

    service = module.get<TransferTokenService>(TransferTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
