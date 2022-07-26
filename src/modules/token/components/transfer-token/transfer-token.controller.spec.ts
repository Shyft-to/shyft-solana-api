import { Test, TestingModule } from '@nestjs/testing';
import { TransferTokenController } from './transfer-token.controller';

describe('MintTokenController', () => {
  let controller: TransferTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferTokenController],
    }).compile();

    controller = module.get<TransferTokenController>(TransferTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
