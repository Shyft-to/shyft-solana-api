import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function TransferTokenOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Transfer Token' }),
    ApiCreatedResponse({
      description: 'Transfer Token successful',
      schema: {
        example: {
          success: true,
          message: 'Transfer token successful',
          result: {
            txhash: "4nCL9h3d761dYQcfo1Jb8ikeN9ydfUtrXeZh3sCbHE32s1LjHxQCJTTjcn7XXTLUTPj3GsfMHyeGngJ7yyeyd1ts",
          },
        },
      },
    }),
  );
}
