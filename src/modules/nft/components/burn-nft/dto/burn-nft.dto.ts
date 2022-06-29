import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class BurnNftDto {
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
    title: 'token_address',
    type: String,
    description: 'Token address',
    example: 'HBE5dEcFHiJtU8vmTyx7MhB43nFRMJt8ddC8Lupc3Jph',
  })
  @IsNotEmpty()
  @IsString()
  readonly token_address: string;

  @ApiProperty({
    title: 'close',
    type: Boolean,
    description: '',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly close: boolean;

  @ApiProperty({
    title: 'amount',
    type: Number,
    description: 'Amount to mint',
    example: 0.001,
  })
  @IsNumber()
  @IsOptional()
  readonly amount: number;
}
