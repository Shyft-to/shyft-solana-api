import { ApiOperation, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function TransferOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Transfer NFT' }),
    ApiConsumes('multipart/form-data'),
    ApiOkResponse({
      description: 'NFT Transfer',
      schema: {
        example: {
          success: true,
          message: 'NFT Transfer successful',
          result: {
            txId: '5NjF2pzAjE9cJq3xfBsVLf9GYWJRdQqgQ3u6k27CtHKwKr6Mh5zqhVgujqfxYEy6LwWNNahyzsk1zYDhEE8a1jqN',
          },
        },
      },
    }),
  );
}
