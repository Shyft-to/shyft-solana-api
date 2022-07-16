import { Test, TestingModule } from '@nestjs/testing';
import { GetTokenController } from './get-token.controller';

describe('MintTokenController', () => {
  let controller: GetTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetTokenController],
    }).compile();

    controller = module.get<GetTokenController>(GetTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
