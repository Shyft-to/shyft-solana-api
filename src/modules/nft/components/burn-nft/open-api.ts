import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function BurnOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Burn NFT' }),
    ApiOkResponse({
      description: 'NFT burned successfully',
      schema: {
        example: {
          success: true,
          message: 'NFT burn request created successfully',
          result: {
            encoded_transaction: '5eG1aSjNoPmScw84G1d7f9n2fgmWabtQEgRjTUXvpTrRH1qduEMwUvUFYiS8px22JNedkWFTUWj9PrRyq1MyessunKC8Mjyq3hH5WZkM15D3gsooH8hsFegyYRBmccLBTEnPph6fExEySkJwsfH6oGC62VmDDCpWyPHZLYv52e4qtUb1TBE6SgXE6FX3TFqrX5HApSkb9ZaCSz21FyyEbXtrmMxBQE1CR7BTyadWL1Vy9SLfo9tnsVpHHDHthFRr',
          },
        },
      },
    }),
  );
}
