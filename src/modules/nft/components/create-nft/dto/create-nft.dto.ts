import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class CreateNftDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select solana blockchain environment',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'private_key',
    type: String,
    description: 'Creator\'s wallet\'s private key',
    example: '5GGZQpoiDPRJLwMonq4ovBBKbxvNq76L3zgMXyiQ5grbPzgF3k35dkHuWwt3GmwVGZBXywXteJcJ53Emsda92D5v',
  })
  @IsNotEmpty()
  @IsString()
  readonly private_key: string;

  @ApiProperty({
    title: 'name',
    type: String,
    description: 'NFT name',
    example: 'fish eyes',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    title: 'symbol',
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
    type: String,
    description: 'Attributes associated to this NFT',
    example: [{ trait_type: 'edification', value: '100' }],
  })
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  attributes: {
    trait_type: string;
    value: string | number;
  }[];

  @ApiPropertyOptional({
    title: 'external_url',
    type: String,
    description: 'An Url to associate with the NFT',
    example: 'https://shyft.to',
  })
  @IsOptional()
  @IsString()
  readonly external_url: string;

  @ApiProperty({
    title: 'max_supply',
    type: Number,
    description: 'Maximum number of clones/edition mints possible for this NFT',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  readonly max_supply: number;

  @ApiProperty({
    title: 'Royalty',
    type: Number,
    description: 'NFT royalty on secondary sales, between 0 - 100',
    example: '5',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    value = Math.max(0, Math.min(value, 100));
    value = value * 100; // since 100 = 1%
    return value;
    },
    { toClassOnly: true },
  )
  readonly royalty: number;

  @ApiProperty({
    name: 'file',
    description: 'Image/pdf/.doc or any file that you would want to turn into nft',
    type: 'string',
    format: 'binary',
  })
  file: string;
}
