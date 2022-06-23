import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

const ReadAllResponse = {
  description: 'Your all NFTs',
  schema: {
    example: {
      success: true,
      message: 'Your all NFTs',
      result: [
        {
          key: 4,
          updateAuthority: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
          mint: 'foMapernfZUpiro3qw7wRQ3221pmccU2oZ3iae9qjqG',
          data: {
            name: 'sample.jpg',
            symbol: 'NAT',
            uri: 'https://ipfs.io/ipfs/bafkreifjaa6nkxy57ebusnyqshac63l7er46j3bzeoc44dxyp3hu5s4sxy',
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
                verified: 1,
                share: 100,
              },
            ],
          },
          primarySaleHappened: 0,
          isMutable: 1,
        },
        {
          key: 4,
          updateAuthority: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
          mint: 'HJ32KZye152eCFQYrKDcoyyq77dVDpa8SXE6v8T1HkBP',
          data: {
            name: 'Fish Eye',
            symbol: 'FYE',
            uri: 'https://ipfs.io/ipfs/bafkreigx7c3s267vty55xutwjkdmllugvwu2mhoowlcvx2nnhjl6k5kjaq',
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
                verified: 1,
                share: 100,
              },
            ],
          },
          primarySaleHappened: 0,
          isMutable: 1,
        },
        {
          key: 4,
          updateAuthority: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
          mint: 'HBE5dEcFHiJtU8vmTyx7MhB43nFRMJt8ddC8Lupc3Jph',
          data: {
            name: 'NIELLY-Francoise-1.png',
            symbol: 'NW',
            uri: 'https://ipfs.io/ipfs/bafkreier6lmezc4aj4fud2xpf5kcxalvwkinklj27mgmnmifaoqmne4zzq',
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
                verified: 1,
                share: 100,
              },
            ],
          },
          primarySaleHappened: 0,
          isMutable: 1,
        },
        {
          key: 4,
          updateAuthority: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
          mint: 'GE7sYdjDoxcqvsd7wzKf8tU2BWBzMDrD5j4eT45jDnJP',
          data: {
            name: 'Monkey NFT',
            symbol: 'MNK',
            uri: 'https://ipfs.io/ipfs/bafkreia5ilycpqhkug7dhfeskyi52yjbpbkqf5l23qodhyn547sakku7a4',
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
                verified: 1,
                share: 100,
              },
            ],
          },
          primarySaleHappened: 0,
          isMutable: 1,
        },
        {
          key: 4,
          updateAuthority: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
          mint: 'DYitxNvtCHhcZHgGLxEsn2SChFfHMThFnZeP8zSCof1X',
          data: {
            name: 'Fish Eye',
            symbol: 'FYE',
            uri: 'https://ipfs.io/ipfs/bafkreigx7c3s267vty55xutwjkdmllugvwu2mhoowlcvx2nnhjl6k5kjaq',
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
                verified: 1,
                share: 100,
              },
            ],
          },
          primarySaleHappened: 0,
          isMutable: 1,
        },
        {
          key: 4,
          updateAuthority: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
          mint: '9HKEL3uPD9wCKigNMUvH2kQhKAVwMfWhj3mr6zLwa7nC',
          data: {
            name: 'Camera',
            symbol: 'CAM',
            uri: 'https://ipfs.io/ipfs/bafkreigajd3rkbyn3dz4erjpcjyzyuyuyrdia5ehnlnbxhqpftn5bmbqji',
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
                verified: 1,
                share: 100,
              },
            ],
          },
          primarySaleHappened: 0,
          isMutable: 1,
        },
      ],
    },
  },
};

export function ReadAllOpenApi() {
  return applyDecorators(ApiOperation({ summary: 'Read all NFT' }), ApiOkResponse(ReadAllResponse));
}

export function ReadOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Read all NFT' }),
    ApiOkResponse({
      description: 'NFT metadata',
      schema: {
        example: {
          success: true,
          message: 'NFT metadata',
          result: {
            name: 'sample.jpg',
            description: 'Kuch bhi',
            symbol: 'NAT',
            image: 'https://ipfs.io/ipfs/bafkreig63wh7rweyww7zidq6trgp6epljkdbcqmazmdoengosdj5pypv7y',
            attributes: {},
          },
        },
      },
    }),
  );
}
