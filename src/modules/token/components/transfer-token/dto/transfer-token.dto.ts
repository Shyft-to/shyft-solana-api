import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class TransferTokenDto {
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
  readonly from_address: string;

  @ApiProperty({
    title: 'receiver',
    type: String,
    description: 'Public Key of receiver',
    example: '5GGZQpoiDPRJLwMonq4ovBBKbxvNq76L3zgMXyiQ5grbPzgF3k35dkHuWwt3GmwVGZBXywXteJcJ53Emsda92D5v',
  })
  @IsNotEmpty()
  @IsString()
  readonly to_address: string;

  @ApiProperty({
    title: 'token_address',
    type: String,
    description: 'Token to transfer',
    example: '2upV85cDWrDRagDkFH7xezbQPwgAaQQS6CyMHFKqrUnq',
  })
  @IsNotEmpty()
  @IsString()
  readonly token_address: string;

  @ApiProperty({
    title: 'amount',
    type: Number,
    description: 'How many tokens do you want to transfer?',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;
}
