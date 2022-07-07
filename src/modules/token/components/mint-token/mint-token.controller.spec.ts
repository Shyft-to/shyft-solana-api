import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from 'src/modules/account/account.service';
import { MintTokenController } from './mint-token.controller';
import { MintTokenService } from './mint-token.service';

describe('MintTokenController', () => {
  let controller: MintTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MintTokenController],
      providers: [MintTokenService, AccountService],
    }).compile();

    controller = module.get<MintTokenController>(MintTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
