import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { User } from 'src/dal/user.schema';
import { AuthService } from './auth.service';

interface IGetUserAuthInfoRequest extends Request {
  email: string; // or any other type
  apiKey: string;
  id: ObjectId;
}

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(public readonly reflector: Reflector, public readonly authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> | never {
    try {
      const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

      if (isPublic) {
        return true;
      }
      const req: IGetUserAuthInfoRequest = context.switchToHttp().getRequest();
      let apiKey: string | string[] = req.headers['x-api-key'];

      if (!apiKey) {
        throw new UnauthorizedException();
      }
      if (Array.isArray(apiKey)) apiKey = apiKey[0];
      const userData: User = await this.authService.validateUser(apiKey);
      if (!userData) {
        throw new UnauthorizedException();
      }
      req.email = userData.email;
      req.id = userData.id;
      req.apiKey = userData.api_key;
      return true;
    } catch (e) {
      throw new HttpException('You are not authorized!', HttpStatus.UNAUTHORIZED);
    }
  }
}
