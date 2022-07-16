import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Network } from '../../../dto/netwotk.dto';

export class BalanceCheckDto {
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
    description: ']',
    example: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
  })
  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
