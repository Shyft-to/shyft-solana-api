import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Network } from '../../../dto/netwotk.dto';

export class SendSolDto {
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
  readonly from_private_key: string;

  @ApiProperty({
    title: 'to_address',
    type: String,
    description: 'RECIPIENT_WALLET_ADDRESS',
    example: '2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc',
  })
  @IsNotEmpty()
  @IsString()
  readonly to_address: string;

  @ApiProperty({
    title: 'amount',
    type: Number,
    description: 'AMOUNT_TO_TRANSFER',
    example: 1.2,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;
}
