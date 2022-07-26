import { Body, Controller, Post, Version } from '@nestjs/common';
import { TransferNftDto } from './dto/transfer.dto';
import { TransferNftService } from './transfer-nft.service';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { TransferOpenApi } from './open-api';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class TransferNftController {
  constructor(private transferService: TransferNftService) {}

  @TransferOpenApi()
  @Post('transfer')
  @Version('1')
  async update(@Body() transferNftDto: TransferNftDto): Promise<any> {
    const res = await this.transferService.transferNft(transferNftDto);

    return {
      success: true,
      message: 'NFT Transfer',
      result: res,
    };
  }
}
