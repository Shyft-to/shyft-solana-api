import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class ReadNftDto {
  @ApiProperty({
    title: 'network',
    type: String,
    enum: Network,
    description: 'Select solana blockchain environment',
  })
  @IsNotEmpty()
  readonly network: Network;

  @ApiProperty({
    title: 'token_address',
    type: String,
    description: 'Token address',
    example: 'GE7sYdjDoxcqvsd7wzKf8tU2BWBzMDrD5j4eT45jDnJP',
  })
  @IsNotEmpty()
  @IsString()
  readonly token_address: string;
}
