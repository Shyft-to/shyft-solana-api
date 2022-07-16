import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { GetTokenService } from './get-token.service';
import { GetTokenDto } from './dto/get-token.dto';
import { GetTokenOpenApi } from './open-api';

@ApiTags('Token')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('token')
export class GetTokenController {
  constructor(private getTokenService: GetTokenService) {}

  @GetTokenOpenApi()
  @Get('get_info')
  @Version('1')
  async getInfo(@Query() getTokenDto: GetTokenDto): Promise<any> {
    const result = await this.getTokenService.getToken(getTokenDto);
    return {
      success: true,
      message: 'Token minted successfully',
      result,
    };
  }
}
