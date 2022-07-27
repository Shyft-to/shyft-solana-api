import { Body, Controller, HttpCode, Post, Version } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SignTransactionDto } from './dto/sign-transaction.dto';
import { SignTransactionOpenApi } from './open-api';
import { SignTransactionService } from './sign-transaction.service';

@ApiTags('Wallet')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('wallet')
@Controller('sign-transaction')
export class SignTransactionController {
  constructor(private readonly signTransactionService: SignTransactionService) {}
  @SignTransactionOpenApi()
  @Post('sign-transaction')
  @Version('1')
  @HttpCode(200)
  async signTransaction(@Body() signTransactionDto: SignTransactionDto): Promise<any> {
    const tx = await this.signTransactionService.signTransaction(signTransactionDto);
    return {
      success: true,
      message: 'Transaction signed successfully',
      result: { tx },
    };
  }
}
