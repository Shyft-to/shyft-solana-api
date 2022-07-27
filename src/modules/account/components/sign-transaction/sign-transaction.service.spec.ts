import { Test, TestingModule } from '@nestjs/testing';
import { SignTransactionService } from './sign-transaction.service';

describe('SignTransactionService', () => {
  let service: SignTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignTransactionService],
    }).compile();

    service = module.get<SignTransactionService>(SignTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
