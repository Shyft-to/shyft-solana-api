import { Test, TestingModule } from '@nestjs/testing';
import { SendSolDetachController } from './send-sol-detach.controller';

describe('SendSolDetachController', () => {
  let controller: SendSolDetachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendSolDetachController],
    }).compile();

    controller = module.get<SendSolDetachController>(SendSolDetachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
