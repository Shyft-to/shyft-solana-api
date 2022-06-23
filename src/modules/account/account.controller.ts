import { Body, Controller, HttpCode, Post, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { BalanceCheckDto } from './dto/balance-check.dto';
import { AccountService } from './account.service';
import { SendSolDto } from './dto/send-sol.dto';

@ApiTags('Account')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @ApiOperation({ summary: 'Check wallet balance' })
  @ApiOkResponse({
    description: 'Balance fetched successfully',
    schema: {
      example: {
        success: true,
        message: 'Balance fetched successfully',
        result: 2.97264288,
      },
    },
  })
  @Post('balance')
  @Version('1')
  @HttpCode(200)
  async balance(@Body() balanceCheckDto: BalanceCheckDto): Promise<any> {
    const balance = await this.accountService.checkBalance(balanceCheckDto);
    return {
      success: true,
      message: 'Balance fetched successfully',
      result: balance,
    };
  }

  @ApiOperation({ summary: 'Transfer wallet balance' })
  @ApiOkResponse({
    description: 'SOL transferred successfully',
    schema: {
      example: {
        success: true,
        message: '1.2 SOL transferred successfully',
        result: {
          amount: 1.2,
          transactionHash: '2WFK7BfYfGvzHGru3nHJtepZadgAkBV6vreVn2D1yeEqLtQ5BrDp38QPVwS78WriGZ9PU1EiYCwQuLcp7XPjxV8B',
        },
      },
    },
  })
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
