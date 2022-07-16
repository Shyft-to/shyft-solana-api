import { Module } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { StorageMetadataService } from '../nft/components/storage-metadata/storage-metadata.service';
import { CreateTokenController } from './components/create-token/create-token.controller';
import { CreateTokenService } from './components/create-token/create-token.service';
import { BurnTokenController } from './components/burn-token/burn-token.controller';
import { BurnTokenService } from './components/burn-token/burn-token.service';
import { MintTokenController } from './components/mint-token/mint-token.controller';
import { MintTokenService } from './components/mint-token/mint-token.service';
import { GetTokenController } from './components/get-token/get-token.controller';
import { GetTokenService } from './components/get-token/get-token.service';

@Module({
  controllers: [CreateTokenController, BurnTokenController, MintTokenController, GetTokenController],
  providers: [CreateTokenService, BurnTokenService, MintTokenService, AccountService, StorageMetadataService, GetTokenService],
})
export class TokenModule {}
