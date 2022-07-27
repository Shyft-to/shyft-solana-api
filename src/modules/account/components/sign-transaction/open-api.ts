import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function SignTransactionOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Transaction signer' }),
    ApiOkResponse({
      description: 'Transaction signed successfully',
      schema: {
        example: {
          success: true,
          message: 'Transaction signed successfully',
          result: {
            tx: '87PYteJ9g1qtLiePnQkKnXHwGkFXoJDXqDMkpVpstpUT2z1extcWmt9Nm25UNx6xgnMnBJTxyqUvsvUYJ1BHCJjWXysQsu4ar9vfTFtgz3jBZ9f6aNqT5eCGaBRJNNtRh2X8sKWmt97zetqx96KoFzZaJF47kkaU6zm6DxPTdQYkzCUi5Davaav1TaEk5cCkC4YQbw1ZzbNF',
          },
        },
      },
    }),
  );
}
