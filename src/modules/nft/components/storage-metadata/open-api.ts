import { ApiOperation, ApiConsumes, ApiCreatedResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function StorageUploadOpenApi() {
  return applyDecorators(
    ApiTags('Storage'),
    ApiOperation({ summary: 'Upload NFT asset' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        title: 'File',
        description: 'File to be uploaded',
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'File uploaded successfully',
      schema: {
        example: {
          success: true,
          message: 'File uploaded successfully',
          result: {
            cid: 'bafkreidw7b75gco2kfvreciexo5b4lakei7xpx6zcktbeyc2xey6hpowa4',
            uri: 'https://ipfs.io/ipfs/bafkreidw7b75gco2kfvreciexo5b4lakei7xpx6zcktbeyc2xey6hpowa4',
          },
        },
      },
    }),
  );
}

export function MetadataCreateOpenApi() {
  return applyDecorators(
    ApiTags('Metadata'),
    ApiOperation({ summary: 'Create NFT metadata' }),
    ApiCreatedResponse({
      description: 'Metadata created successfully',
      schema: {
        example: {
          success: true,
          message: 'Metadata created successfully',
          result: {
            cid: 'bafkreifwzh2o2fsyxmcblu7p7rmx4rdlksoepsli3djtlz7jmeknkz446y',
            uri: 'https://ipfs.io/ipfs/bafkreifwzh2o2fsyxmcblu7p7rmx4rdlksoepsli3djtlz7jmeknkz446y',
          },
        },
      },
    }),
  );
}
