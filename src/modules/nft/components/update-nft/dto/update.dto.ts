import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class UpdateNftDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select network',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'private_key',
    type: String,
    description: 'YOUR_WALLET_PRIVATE_KEY',
    example: '5GGZQpoiDPRJLwMonq4ovBBKbxvNq76L3zgMXyiQ5grbPzgF3k35dkHuWwt3GmwVGZBXywXteJcJ53Emsda92D5v',
  })
  @IsNotEmpty()
  @IsString()
  readonly private_key: string;

  @ApiProperty({
    title: 'tokenAddress',
    type: String,
    description: 'YOUR_NFT_TOKEN_ADDRESS',
    example: 'HJ32KZye152eCFQYrKDcoyyq77dVDpa8SXE6v8T1HkBP',
  })
  @IsNotEmpty()
  @IsString()
  readonly tokenAddress: string;

  @ApiProperty({
    title: 'updateAuthority',
    type: String,
    description: 'WALLET_ADDRESS',
    example: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
  })
  @IsNotEmpty()
  @IsString()
  readonly updateAuthority: string;

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
    type: Object,
    description: 'NFT attributes',
    example: [{ trait_type: 'edification', value: '100' }],
  })
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  attributes: {
    trait_type: string;
    value: string | number;
  }[];

  @ApiProperty({
    title: 'share',
    type: String,
    description: 'NFT share',
    example: '100',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  readonly share: number;

  @ApiPropertyOptional({
    title: 'external_url',
    type: String,
    description: 'NFT external URL',
    example: 'https://www.example.com',
  })
  @IsOptional()
  @IsString()
  readonly externalUrl: string;

  @ApiProperty({
    title: 'is_mutable',
    type: String,
    description: 'mutable or not',
    example: 'true',
  })
  @IsNotEmpty()
  @Transform(
    ({ value }) => {
      return value === false || value === 0 ? false : true;
    },
    { toClassOnly: true },
  )
  readonly is_mutable: boolean;

  @ApiPropertyOptional({
    title: 'primary_sale_happened',
    type: String,
    description: 'primary sale happened or not',
    example: 'false',
  })
  @IsOptional()
  @Transform(
    ({ value }) => {
      return value === false || value === 0 ? false : true;
    },
    { toClassOnly: true },
  )
  readonly primary_sale_happened: boolean;

  @ApiProperty({
    title: 'seller_fee_basis_points',
    type: String,
    description: 'NFT seller fee basis points',
    example: '100',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  readonly seller_fee_basis_points: number;

  @ApiProperty({
    name: 'file',
    description: 'File to be uploaded',
    type: 'string',
    format: 'binary',
  })
  file: string;
}
