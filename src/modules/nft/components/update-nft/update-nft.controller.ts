import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateNftDto } from './dto/update.dto';
import { UpdateNftService } from './update-nft.service';
import { Blob } from 'nft.storage';
import { StorageMetadataService } from '../storage-metadata/storage-metadata.service';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { UpdateOpenApi } from './open-api';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class UpdateNftController {
  constructor(
    private updateNftService: UpdateNftService,
    private storageService: StorageMetadataService,
  ) { }

  @UpdateOpenApi()
  @Put('update')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateNftDto: UpdateNftDto,
  ): Promise<any> {
    const uploadImage = await this.storageService.uploadToIPFS(
      new Blob([file.buffer], { type: file.mimetype }),
    );
    const image = uploadImage.uri;
    const { uri } = await this.storageService.prepareMetaData({
      network: updateNftDto.network,
      private_key: updateNftDto.private_key,
      image,
      name: updateNftDto.name,
      description: updateNftDto.description,
      symbol: updateNftDto.symbol,
      attributes: updateNftDto.attributes,
      share: updateNftDto.share,
      seller_fee_basis_points: updateNftDto.seller_fee_basis_points,
      external_url: updateNftDto.external_url,
    });

    const res = await this.updateNftService.updateNft(updateNftDto, uri);
    return {
      success: true,
      message: 'NFT updated',
      result: res,
    };
  }
}
