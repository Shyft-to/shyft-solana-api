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
import { BalanceCheckDto, ResolveAddressDto } from './dto/balance-check.dto';
import { WalletService } from './account.service';
import { SendSolDto } from './dto/send-sol.dto';
import {
  AllTokensOpenApi,
  BalanceCheckOpenApi,
  PortfoliOpenApi,
  SendBalanceOpenApi,
  TokenBalanceOpenApi,
} from './open-api';
import { TokenBalanceCheckDto } from './dto/token-balance-check.dto';

@ApiTags('Wallet')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('wallet')
export class AccountController {
  constructor(private readonly walletService: WalletService) {}
  @BalanceCheckOpenApi()
  @Get('balance')
  @Version('1')
  async balance(@Query() balanceCheckDto: BalanceCheckDto): Promise<any> {
    const balance = await this.walletService.getBalance(balanceCheckDto);
    return {
      success: true,
      message: 'Balance fetched successfully',
      result: { balance: balance },
    };
  }

  @SendBalanceOpenApi()
  @Post('send_sol')
  @Version('1')
  @HttpCode(200)
  async sendSol(@Body() sendSolDto: SendSolDto): Promise<any> {
    const { amount } = sendSolDto;
    const transactionHash = await this.walletService.sendSol(sendSolDto);
    return {
      success: true,
      message: `${amount} SOL transferred successfully`,
      result: {
        amount,
        transactionHash,
      },
    };
  }

  @TokenBalanceOpenApi()
  @Get('token_balance')
  @Version('1')
  async tokenBalance(@Query() tokenBalanceCheckDto: TokenBalanceCheckDto): Promise<any> {
    const balance = await this.walletService.getTokenBalance(tokenBalanceCheckDto);
    return {
      success: true,
      message: 'Token balance fetched successfully',
      result: { balance: balance },
    };
  }

  @PortfoliOpenApi()
  @Get('get_portfolio')
  @Version('1')
  async portfolio(@Query() balanceCheckDto: BalanceCheckDto): Promise<any> {
    const res = await this.walletService.getPortfolio(balanceCheckDto);
    return {
      success: true,
      message: 'Portfolio fetched successfully',
      result: res,
    };
  }

  @AllTokensOpenApi()
  @Get('all_tokens')
  @Version('1')
  async allTokens(@Query() balanceCheckDto: BalanceCheckDto): Promise<any> {
    const allTokens = await this.walletService.getAllTokensBalance(balanceCheckDto);
    const count = Object.keys(allTokens)?.length ?? 0;
    return {
      success: true,
      message: `${count} tokens fetched successfully`,
      result: allTokens,
    };
  }

  @AllTokensOpenApi()
  @Get('get_domains')
  @Version('1')
  async getDomains(@Query() balanceCheckDto: BalanceCheckDto): Promise<any> {
    const allTokens = await this.walletService.getDomains(balanceCheckDto);
    const count = Object.keys(allTokens)?.length ?? 0;
    return {
      success: true,
      message: `${count} domains fetched successfully`,
      result: allTokens,
    };
  }

  @AllTokensOpenApi()
  @Get('resolve_address')
  @Version('1')
  async resolveAddress(@Query() addressDto: ResolveAddressDto): Promise<any> {
    const allTokens = await this.walletService.resolveAddress(addressDto);
    return {
      success: true,
      message: 'Address resolved successfully',
      result: allTokens,
    };
  }
}
