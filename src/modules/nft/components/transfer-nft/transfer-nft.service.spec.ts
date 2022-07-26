import { Test, TestingModule } from '@nestjs/testing';
import { TransferNftService } from './transfer-nft.service';

describe('TransferNftService', () => {
  let service: TransferNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferNftService],
    }).compile();

    service = module.get<TransferNftService>(TransferNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
