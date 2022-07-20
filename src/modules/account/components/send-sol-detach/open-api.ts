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
            transactionBuffer: {
              type: 'Buffer',
              data: [
                1, 0, 1, 3, 152, 85, 152, 181, 228, 111, 37, 140, 54, 28, 135,
                198, 129, 64, 27, 24, 42, 243, 211, 76, 206, 115, 87, 241, 252,
                4, 141, 163, 186, 17, 154, 246, 24, 202, 159, 81, 197, 71, 30,
                237, 190, 151, 37, 57, 131, 31, 112, 83, 106, 198, 198, 77, 141,
                161, 37, 237, 161, 211, 18, 117, 235, 254, 15, 21, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 229, 215, 221, 205, 119, 153, 30, 188, 96,
                80, 128, 166, 38, 86, 169, 38, 250, 77, 68, 119, 100, 71, 103,
                165, 23, 157, 247, 209, 131, 163, 17, 13, 1, 2, 2, 0, 1, 12, 2,
                0, 0, 0, 0, 194, 235, 11, 0, 0, 0, 0,
              ],
            },
          },
        },
      },
    }),
  );
}
