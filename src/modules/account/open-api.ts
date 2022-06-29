import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function BalanceCheckOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Check wallet balance' }),
    ApiOkResponse({
      description: 'Balance fetched successfully',
      schema: {
        example: {
          success: true,
          message: 'Balance fetched successfully',
          result: 2.97264288,
        },
      },
    }),
  );
}

export function SendBalanceOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Transfer wallet balance' }),
    ApiOkResponse({
      description: 'SOL transferred successfully',
      schema: {
        example: {
          success: true,
          message: '1.2 SOL transferred successfully',
          result: {
            amount: 1.2,
            transactionHash:
              '2WFK7BfYfGvzHGru3nHJtepZadgAkBV6vreVn2D1yeEqLtQ5BrDp38QPVwS78WriGZ9PU1EiYCwQuLcp7XPjxV8B',
          },
        },
      },
    }),
  );
}
