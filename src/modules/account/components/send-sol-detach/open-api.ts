import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function SendBalanceDetachOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Transfer wallet balance without private_key' }),
    ApiOkResponse({
      description: 'Transaction initiated successfully',
      schema: {
        example: {
          success: true,
          message: 'Transaction created',
          result: {
            tx: '5S7tJbjKwSn1iUkibeHgL4DepG5TysAqJ8WTAFBT3b4mTekRbeoGd13hkbw5zRi9knZGwn6xmtx6JHnpqXocYybe',
          },
        },
      },
    }),
  );
}
