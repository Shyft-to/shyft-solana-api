import { Test, TestingModule } from '@nestjs/testing';
import { TransferNftController } from './transfer-nft.controller';

describe('UpdateNftController', () => {
  let controller: TransferNftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferNftController],
    }).compile();

    controller = module.get<TransferNftController>(TransferNftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
