import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from '../db/db.module';
import { User, UserSchema } from 'src/dal/user.schema';
import { AccountController } from './account.controller';
import { WalletService } from './account.service';
import { RemoteDataFetcherService } from '../db/remote-data-fetcher/data-fetcher.service';
import { SendSolDetachController } from './components/send-sol-detach/send-sol-detach.controller';
import { SendSolDetachService } from './components/send-sol-detach/send-sol-detach.service';

@Module({
  controllers: [AccountController, SendSolDetachController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), DbModule],
  providers: [WalletService, RemoteDataFetcherService, SendSolDetachService],
})
export class AccountModule {}
