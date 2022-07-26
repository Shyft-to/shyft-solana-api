import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
    description: 'Name of the NFT',
    example: 'Shyft',
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    title: 'new_update_authority',
    type: String,
    description: 'New update authority',
    example: '97a3giHcGsk8YoEgWv4rP1ooWwJBgS72fpckZM6mQiFH',
  })
  @IsString()
  @IsOptional()
  readonly new_update_authority: string;

  @ApiProperty({
    title: 'symbol',
    type: String,
    description: 'NFT symbol',
    example: 'SH',
  })
  @IsString()
  @IsOptional()
  readonly symbol: string;

  @ApiProperty({
    title: 'description',
    type: String,
    description: 'NFT description',
    example: 'Shyft makes web3 development easy',
  })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    title: 'attributes',
    type: Object,
    description: 'attributes associated to this NFT ',
    example: [{ trait_type: 'edification', value: '100' }],
  })
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  @IsOptional()
  attributes: object;

  @ApiProperty({
    title: 'seller_fee_basis_points',
    type: String,
    description: 'NFT royalty on secondary sales, between 0 - 100',
    example: '100',
  })
  @IsNumber()
  @Transform(({ value }) => {
    value = Math.max(0, Math.min(value, 100));
    value = value * 100; // since 100 = 1%
    return value;
  },
    { toClassOnly: true },
  )
  @IsOptional()
  readonly royalty: number;

  @ApiProperty({
    name: 'file',
    description: 'digital file that NFT represents',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file: string;
}
