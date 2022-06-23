import { MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import { IsNotEmpty, IsString } from 'class-validator';
import { NftInfo } from 'src/dal/nft-repo/nft-info.schema';
import { Network } from 'src/dto/netwotk.dto';

export class FetchAllNftDto {
  constructor(network: Network, address: string) {
    this.network = network;
    this.walletAddress = address;
  }

  @IsNotEmpty()
  readonly network: Network;
  @IsNotEmpty()
  @IsString()
  readonly walletAddress: string;
}

export class FetchNftDto {
  constructor(network: Network, address: string) {
    this.network = network;
    this.tokenAddress = address;
  }

  @IsNotEmpty()
  readonly network: Network;
  @IsNotEmpty()
  @IsString()
  readonly tokenAddress: string;
}

export class NftData {
  onChainMetadata: MetadataData;
  offChainMetadata: any;

  constructor(onChainData: MetadataData, offChainData: any) {
    this.onChainMetadata = onChainData;
    this.offChainMetadata = offChainData;
  }

  public getNftInfoDto(): NftInfo {
    const nftDbDto = new NftInfo();
    nftDbDto.update_authority = this.onChainMetadata.updateAuthority;
    nftDbDto.mint = this.onChainMetadata.mint;
    nftDbDto.owner = this.onChainMetadata.updateAuthority;
    nftDbDto.primary_sale_happened = this.onChainMetadata.primarySaleHappened;
    nftDbDto.is_mutable = this.onChainMetadata.isMutable;
    nftDbDto.name = this.onChainMetadata.data.name;
    nftDbDto.symbol = this.onChainMetadata.data.symbol;
    nftDbDto.seller_fee_basis_points = this.onChainMetadata.data.sellerFeeBasisPoints;
    nftDbDto.metadata_uri = this.onChainMetadata.data.uri;
    nftDbDto.creators = this.onChainMetadata.data?.creators.map((cr) => {
      return {
        address: cr.address,
        share: cr.share,
        verified: cr.verified,
      };
    });
    nftDbDto.image_uri = this.offChainMetadata?.image;
    nftDbDto.description = this.offChainMetadata?.description;
    nftDbDto.external_url = this.offChainMetadata?.external_url;
    nftDbDto.attributes = {};
    this.offChainMetadata?.attributes.map((trait) => {
      nftDbDto.attributes[trait?.trait_type] = trait?.value;
    });
    return nftDbDto;
  }
}
