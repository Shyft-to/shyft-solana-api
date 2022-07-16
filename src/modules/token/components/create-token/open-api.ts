import { ApiOperation, ApiCreatedResponse, ApiConsumes } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function CreateTokenOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Token' }),
    ApiConsumes('multipart/form-data'),
    ApiCreatedResponse({
      description: 'Token created successfully',
      schema: {
        example: {
          success: true,
          message: 'Token created successfully',
          result: {
            txhash: "3j7CrPu3DMp6SMPS6YbML4WMd3c5v2kXDraSYLrqHWbZTCApwdSgWc7RbWnvLMSu8MjFe7FEbQHuPuHScLo4STdb",
            token_address: "EAmTA4TiEPShWKgy3G1iYyco3suogTocZVVbAwqjoPKV",
          },
        },
      },
    }),
  );
}
