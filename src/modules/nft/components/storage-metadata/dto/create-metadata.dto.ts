import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class CreateMetadataDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select network',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'Creator',
    type: String,
    description: 'Creaors Wallet Address',
    example: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
  })
  @IsNotEmpty()
  @IsString()
  readonly creator: string;

  @ApiProperty({
    title: 'image',
    type: String,
    description: 'NFT image URL',
    example: 'https://ipfs.io/ipfs/bafkreigx7c3s267vty55xutwjkdmllugvwu2mhoowlcvx2nnhjl6k5kjaq',
  })
  @IsNotEmpty()
  @IsString()
  readonly image: string;

  @ApiProperty({
    title: 'name',
    type: String,
    description: 'NFT name',
    example: 'Fish Eye',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    title: 'description',
    type: String,
    description: 'NFT symbol',
    example: 'FYE',
  })
  @IsNotEmpty()
  @IsString()
  readonly symbol: string;

  @ApiProperty({
    title: 'description',
    type: String,
    description: 'NFT description',
    example: 'Girl with beautiful eyes',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    title: 'attributes',
    type: Array,
    description: 'NFT attributes',
    example: [{ trait_type: 'edification', value: '100' }],
  })
  @IsNotEmpty()
  attributes: {
    trait_type: string;
    value: string | number;
  }[];

  @ApiProperty({
    title: 'share',
    type: Number,
    description: 'NFT share',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly share: number;

  @ApiPropertyOptional({
    title: 'external_url',
    type: String,
    description: 'NFT external URL',
    example: 'https://www.example.com',
  })
  @IsOptional()
  @IsString()
  readonly external_url: string;

  @ApiPropertyOptional({
    title: 'seller_fee_basis_points',
    type: Number,
    description: 'NFT seller_fee_basis_points',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  readonly royalty: number;
}
