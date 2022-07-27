import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class SignTransactionDto {
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
    description: "Creator's wallet's private key",
    example: '5GGZQpoiDPRJLwMonq4ovBBKbxvNq76L3zgMXyiQ5grbPzgF3k35dkHuWwt3GmwVGZBXywXteJcJ53Emsda92D5v',
  })
  @IsNotEmpty()
  @IsString()
  readonly private_key: string;

  @ApiProperty({
    title: 'encoded_transaction',
    type: String,
    description: 'Transaction needed to sign',
    example: '5eG1aSjNoPmScw84G1d7f9n2fgmWabtQEgRjTUXvpTrRH1qduEMwUvUFYiS8px22JNedkWFTUWj9PrRyq1MyessunKC8Mjyq3hH5WZkM15D3gsooH8hsFegyYRBmccLBTEnPph6fExEySkJwsfH6oGC62VmDDCpWyPHZLYv52e4qtUb1TBE6SgXE6FX3TFqrX5HApSkb9ZaCSz21FyyEbXtrmMxBQE1CR7BTyadWL1Vy9SLfo9tnsVpHHDHthFRr',
  })
  @IsNotEmpty()
  @IsString()
  readonly encoded_transaction: string;
}
