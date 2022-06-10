import { IsNotEmpty, IsString } from 'class-validator';
import { Network } from 'src/dto/netwotk.dto';

export class CreateNftDto {
  @IsNotEmpty()
  readonly network: Network;
  @IsNotEmpty()
  @IsString()
  readonly private_key: string;
  @IsNotEmpty()
  @IsString()
  readonly metadata_uri: string;
}
