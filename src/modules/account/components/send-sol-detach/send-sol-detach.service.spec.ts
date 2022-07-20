import { Test, TestingModule } from '@nestjs/testing';
import { SendSolDetachService } from './send-sol-detach.service';

describe('SendSolDetachService', () => {
  let service: SendSolDetachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendSolDetachService],
    }).compile();

    service = module.get<SendSolDetachService>(SendSolDetachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
