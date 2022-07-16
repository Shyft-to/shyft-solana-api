import { Body, Controller, Delete, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { BurnTokenService } from './burn-token.service';
import { BurnTokenDto } from './dto/burn-token.dto';
import { BurnTokenOpenApi } from './open-api';

@ApiTags('Token')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('token')
export class BurnTokenController {
  constructor(private burnTokenService: BurnTokenService) {}

  @BurnTokenOpenApi()
  @Delete('burn')
  @Version('1')
  async burnToken(@Body() burnTokenDto: BurnTokenDto): Promise<any> {
    const result = await this.burnTokenService.burnToken(burnTokenDto);
    return {
      success: true,
      message: 'Token burned successfully',
      result,
    };
  }
}
