import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class BurnNftDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select solana blockchain environment',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'address',
    type: String,
    description: 'NFT holder wallet\'s address',
    example: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

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
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly close: boolean;
}
