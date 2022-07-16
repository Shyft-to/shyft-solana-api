import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class CreateTokenDto {
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
  private_key: string;

  @ApiProperty({
    title: 'name',
    type: String,
    description: 'Token name',
    example: 'Shyft',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    title: 'Freeze Authority',
    type: String,
    description: 'Who has the authority to freeze this token, no more tokens would be created.',
    example: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly freeze_authority: string;

  @ApiProperty({
    title: 'mint Authority',
    type: String,
    description: 'Who has the authority to mint more of these tokens.',
    example: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly mint_authority: string;

  @ApiProperty({
    title: 'symbol',
    type: String,
    description: 'Token symbol',
    example: 'SHY',
  })
  @IsNotEmpty()
  @IsString()
  readonly symbol: string;

  @ApiProperty({
    title: 'Decimals',
    type: Number,
    description: 'How many decimals in one 1 token',
    example: 'default: 9',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  readonly decimals: number;

  @ApiProperty({
    title: 'description',
    type: String,
    description: 'Token description',
    example: 'This is a test token',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    name: 'file',
    description: 'Token image to be uploaded',
    type: 'string',
    format: 'binary',
  })
  file: string;
}
