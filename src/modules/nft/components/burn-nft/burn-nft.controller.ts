import { Body, Controller, Delete, Req, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { BurnNftDto } from './dto/burn-nft.dto';
import { BurnNftService } from './burn-nft.service';
import { BurnOpenApi } from './open-api';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class BurnNftController {
  constructor(private burnNftService: BurnNftService) { }
  @BurnOpenApi()
  @Delete('burn')
  @Version('1')
  async burnNft(@Body() burnNftDto: BurnNftDto): Promise<any> {
    const encoded_transaction = await this.burnNftService.burnNft(burnNftDto);

    return {
      success: true,
      message: 'NFT burn request created successfully',
      result: { encoded_transaction },
    };
  }
}
