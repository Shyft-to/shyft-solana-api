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
            transactionBuffer: '87PYteJ9g1qtLiePnQkKnXHwGkFXoJDXqDMkpVpstpUT2z1extcWmt9Nm25UNx6xgnMnBJTxyqUvsvUYJ1BHCJjWXysQsu4ar9vfTFtgz3jBZ9f6aNqT5eCGaBRJNNtRh2X8sKWmt97zetqx96KoFzZaJF47kkaU6zm6DxPTdQYkzCUi5Davaav1TaEk5cCkC4YQbw1ZzbNF',
          },
        },
      },
    }),
  );
}
