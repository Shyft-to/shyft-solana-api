import { Body, Controller, HttpCode, Post, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { SendSolDetachDto } from './dto/send-sol-detach.dto';
import { SendBalanceDetachOpenApi } from './open-api'; 
import { SendSolDetachService } from './send-sol-detach.service';


@ApiTags('Wallet')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('wallet')
export class SendSolDetachController {
  constructor(private readonly sendSolDetachService: SendSolDetachService) {}
  @SendBalanceDetachOpenApi()
  @Post('send_sol_detach')
  @Version('1')
  @HttpCode(200)
  async sendSol(@Body() sendSolDto: SendSolDetachDto): Promise<any> {
    const { amount } = sendSolDto;
    const transactionBuffer = await this.sendSolDetachService.sendSol(sendSolDto);
    return {
      success: true,
      message: `${amount} SOL transferred successfully`,
      result: { transactionBuffer },
    };
  }
}
