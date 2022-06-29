import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/dal/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) {}

  public async validateUser(apiKey: string): Promise<User> {
    const user = await this.userModel.findOne({ api_key: apiKey });
    if (user) {
      return user;
    }
    return null;
  }
}
