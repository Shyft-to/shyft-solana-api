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
    title: 'address',
    type: String,
    description: 'YOUR_WALLET_ADDRESS',
    example: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

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
    description: 'How many decimals in one 1 token (default: 9)',
    example: '9',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    value = parseInt(value);
    value = value ?? 9;
    return value;
  })
  readonly decimals: number;

  @ApiProperty({
    title: 'description',
    type: String,
    description: 'Token description',
    example: 'This is a test token',
  })
  @IsOptional()
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
