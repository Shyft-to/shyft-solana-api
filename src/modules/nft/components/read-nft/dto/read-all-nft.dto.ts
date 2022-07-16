import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class ReadAllNftDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select solana blockchain environment',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'wallet_address',
    type: String,
    description: 'Your wallet address',
    example: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty({
    title: 'update_authority address. Filters only those nfts in your wallet which have this update_authority.',
    type: String,
    description: 'Update Authority, projects wallet address',
    example: 'BvzKvn6nUUAYtKu2pH3h5SbUkUNcRPQawg4bURBiojJx',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly update_authority: string;
}
