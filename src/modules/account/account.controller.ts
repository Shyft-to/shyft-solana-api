import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { BalanceCheckDto } from './dto/balance-check.dto';
import { AccountService } from './account.service';
import { SendSolDto } from './dto/send-sol.dto';
import { BalanceCheckOpenApi, SendBalanceOpenApi } from './open-api';

@ApiTags('Account')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @BalanceCheckOpenApi()
  @Get('balance')
  @Version('1')
  async balance(@Query() balanceCheckDto: BalanceCheckDto): Promise<any> {
    const balance = await this.accountService.checkBalance(balanceCheckDto);
    return {
      success: true,
      message: 'Balance fetched successfully',
      result: balance,
    };
  }

  @SendBalanceOpenApi()
  @Post('send_sol')
  @Version('1')
  @HttpCode(200)
  async sendSol(@Body() sendSolDto: SendSolDto): Promise<any> {
    const { amount } = sendSolDto;
    const transactionHash = await this.accountService.sendSol(sendSolDto);
    return {
      success: true,
      message: `${amount} SOL transferred successfully`,
      result: {
        amount,
        transactionHash,
      },
    };
  }
}
