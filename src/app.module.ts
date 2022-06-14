import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { NftModule } from './modules/nft/nft.module';
import { configuration } from './common/configs/config';
import { AuthModule } from './modules/auth/auth.module';
import { User, UserSchema } from './schemas/user.schema';
import { Emailer } from './common/utils/emailer';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AccountModule,
    NftModule,
    AuthModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, Emailer],
})
export class AppModule { }
