import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function BurnTokenOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Burn Token' }),
    ApiOkResponse({
      description: 'Token burn request created successfully',
      schema: {
        example: {
          success: true,
          message: 'Token burn request created successfully',
          result: {
            encoded_transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEEGMqfUcVHHu2+lyU5gx9wU2rGxk2NoSXtodMSdev+DxVnPGbuL3I5sdaYYekm911jZ8FT/8OJhxhjtqU2HL3iCJ6DOOr5Uk+yylq542F14PAEHuMIrC7H+sPmLu62MSw6Bt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKla0+cMY+GCyK53DDR+5xRlgpjUmUkw0qD5Fbe4t+yhSAEDAwECAAoPAMqaOwAAAAAJ',
          },
        },
      },
    }),
  );
}
