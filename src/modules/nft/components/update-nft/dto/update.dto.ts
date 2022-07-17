import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class UpdateNftDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select solana blockchain environment ',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'private_key',
    type: String,
    description: 'NFT holder\'s wallet\'s private key',
    example: '5GGZQpoiDPRJLwMonq4ovBBKbxvNq76L3zgMXyiQ5grbPzgF3k35dkHuWwt3GmwVGZBXywXteJcJ53Emsda92D5v',
  })
  @IsNotEmpty()
  @IsString()
  readonly private_key: string;

  @ApiProperty({
    title: 'token_address',
    type: String,
    description: 'address of the NFT to be updated',
    example: 'HJ32KZye152eCFQYrKDcoyyq77dVDpa8SXE6v8T1HkBP',
  })
  @IsNotEmpty()
  @IsString()
  readonly token_address: string;

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
    description: 'attributes associated to this NFT ',
    example: [{ trait_type: 'edification', value: '100' }],
  })
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  attributes: object;

  @ApiProperty({
    title: 'seller_fee_basis_points',
    type: String,
    description: 'NFT royalty on secondary sales, between 0 - 100',
    example: '100',
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
    description: 'digital file that NFT represents',
    type: 'string',
    format: 'binary',
  })
  file: string;
}
