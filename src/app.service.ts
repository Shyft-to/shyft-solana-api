import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { customAlphabet } from 'nanoid/async';
import { User, UserDocument } from 'src/schemas/user.schema';
import { GetApiKeyDto } from './dto/get-api-key.dto';
import { Emailer } from './common/utils/emailer';

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
const nanoid = customAlphabet(alphabet, 16);

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly emailer: Emailer,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getApiKey(getApiKeyDto: GetApiKeyDto): Promise<boolean> {
    try {
      let result = await this.userModel.findOne(getApiKeyDto);
      if (!result) {
        const apiKey = await nanoid();
        result = await this.userModel.create({
          ...getApiKeyDto,
          apiKey,
        });
      }
      const destinationEmailAddess = result.email;
      const templateName = 'ApiKeyTemplate';
      const templateData = {
        apiKey: result.apiKey,
      };
      await this.emailer.sendEmail(
        destinationEmailAddess,
        templateName,
        templateData,
      );
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
