import { Body, Controller, Delete, Version } from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BurnNftDto } from './dto/burn-nft.dto';
import { BurnNftService } from './burn-nft.service';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class BurnNftController {
  constructor(private burnNftService: BurnNftService) {}
  @ApiOperation({ summary: 'Burn NFT' })
  @ApiOkResponse({
    description: 'NFT burned successfully',
    schema: {
      example: {
        success: true,
        message: 'NFT burned successfully',
        result: {
          txId: 'T9xnfTpcZhzhT6UBjQKkD5bDXtw4agZw7btBGND6dTLJJKWhpE24a5BhsHVjmAU1eCCS9fqM6TZ8Hg2u4F2vXTM',
        },
      },
    },
  })
  @Delete('burn')
  @Version('1')
  async readNft(@Body() burnNftDto: BurnNftDto): Promise<any> {
    const result = await this.burnNftService.burnNft(burnNftDto);
    return {
      success: true,
      message: 'NFT burned successfully',
      result,
    };
  }
}
