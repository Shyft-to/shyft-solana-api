import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

const ReadAllResponse = {
  description: 'Your all NFTs',
  schema: {
    example: {
      success: true,
      message: 'Your all NFTs',
      result: {
        count: 3,
        nfts: [
          {
            name: 'Shyft',
            symbol: 'SH',
            royalty: 0,
            image_uri: 'https://ipfs.io/ipfs/bafkreibivcky2t2bycsycp5d57ubtqaznqtqdnnw7grbvrrc4zdfrnspfu',
            description: 'Shyft, not accenture',
            attributes: {},
            mint: '3PCt2frS9X5RwuH2KnebpUpHXcAqszvrWHnZg2m1wqDr',
            owner: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
          },
          {
            name: 'SHYFT',
            symbol: 'SHF',
            royalty: 5,
            image_uri: 'https://ipfs.io/ipfs/bafkreig7amamflgtsovczf2el7jt7kuwf274jeaeofjy7iaa34r7exydzm',
            description: 'some description',
            attributes: {
              health: 100,
            },
            mint: '9XTGWZENKa18N1vgCQ3RjJWHG92Di2JKYi73jiC4hkEM',
            owner: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
          },
          {
            name: 'Nightweaver',
            symbol: 'NW',
            royalty: 0,
            image_uri: 'ipfs://bafkreibivcky2t2bycsycp5d57ubtqaznqtqdnnw7grbvrrc4zdfrnspfu',
            description:
              'Night is considered to be a synonym for black in many cultures, a color which can absorb every other color. The Noki tribe, creators of this sword is believed by many to dwell in the darkness. Forged using the dark energy of the night, this sword can even slice through darkness itself.',
            attributes: {
              Performance: '28',
              Fortune: '20',
              Regeneration: '26',
              Quality: 'Rare',
            },
            mint: 'ApJPjFr585xKSMk7EtAKU4UrcpyEgdN7X8trvd3gChYk',
            owner: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
          },
        ],
      },
    },
  },
};

export function ReadAllOpenApi() {
  return applyDecorators(ApiOperation({ summary: 'Read all NFT' }), ApiOkResponse(ReadAllResponse));
}

export function ReadOpenApi() {
  return applyDecorators(
    ApiOperation({ summary: 'Read all NFTs from wallet' }),
    ApiOkResponse({
      description: 'NFT metadata',
      schema: {
        example: {
          success: true,
          message: 'NFT metadata',
          result: {
            name: 'SHYFT',
            description: 'some description',
            symbol: 'SHF',
            image_uri: 'https://ipfs.io/ipfs/bafkreig7amamflgtsovczf2el7jt7kuwf274jeaeofjy7iaa34r7exydzm',
            attributes: {
              health: 100,
            },
            royalty: 5,
            mint: '9XTGWZENKa18N1vgCQ3RjJWHG92Di2JKYi73jiC4hkEM',
            owner: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
          },
        },
      },
    }),
  );
}
