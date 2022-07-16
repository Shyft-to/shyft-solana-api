import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function GetTokenOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Mint Token' }),
    ApiCreatedResponse({
      description: 'Token info',
      schema: {
        example: {
          success: true,
          message: 'Tokens detailed info',
          result: {
            name: 'Shyft (Token name)',
            symbol: 'SH (tokens symbol)',
            description: 'Any description for the token',
            logo: 'Token logo URI',
            mint_authorioty: 'Who can mint these tokens',
            freeze_authority: 'who can freeze these tokens',
            current_supply: 'current circulating supply',
          }
          },
        },
    }),
  );
}
