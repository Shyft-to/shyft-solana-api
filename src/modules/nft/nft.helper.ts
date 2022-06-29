export interface NftMetadata {
  name: string;
  description: string;
  symbol: string;
  image_uri: string;
  royalty: number;
  mint: string;
  attributes: { trait_type: string; value: string }[];
}
export const nftHelper = {
  parseMetadata: async function name(params: NftMetadata): Promise<unknown> {
    //parse and return only valuable fields
    const meta = {};
    meta['name'] = params?.name;
    meta['description'] = params?.description;
    meta['symbol'] = params?.symbol;
    meta['image_uri'] = params?.image_uri;
    meta['royalty'] = params?.royalty;
    meta['mint'] = params?.mint;
    meta['attributes'] = {};
    params?.attributes.map((trait) => {
      meta['attributes'][trait?.trait_type] = trait?.value;
    });

    return meta;
  },
};
