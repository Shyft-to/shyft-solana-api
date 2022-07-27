import { Test, TestingModule } from '@nestjs/testing';
import { SignTransactionController } from './sign-transaction.controller';

describe('SignTransactionController', () => {
  let controller: SignTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignTransactionController],
    }).compile();

    controller = module.get<SignTransactionController>(SignTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
