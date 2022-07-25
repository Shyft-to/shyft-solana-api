import { Test, TestingModule } from '@nestjs/testing';
import { BurnTokenController } from './burn-token.controller';
import { BurnTokenService } from './burn-token.service';
import { AccountService } from 'src/modules/account/account.service';

describe('BurnTokenController', () => {
  let controller: BurnTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BurnTokenController],
      providers: [BurnTokenService, AccountService],
    }).compile();

    controller = module.get<BurnTokenController>(BurnTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
