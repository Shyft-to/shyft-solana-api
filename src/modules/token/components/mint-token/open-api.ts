import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function MintTokenOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Mint Token' }),
    ApiCreatedResponse({
      description: 'Token minted successfully',
      schema: {
        example: {
          success: true,
          message: 'Token minted successfully',
          result: {
            txhash: "4nCL9h3d761dYQcfo1Jb8ikeN9ydfUtrXeZh3sCbHE32s1LjHxQCJTTjcn7XXTLUTPj3GsfMHyeGngJ7yyeyd1ts",
          },
        },
      },
    }),
  );
}
