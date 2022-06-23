import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/dal/user.schema';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [AccountService],
})
export class AccountModule {}
