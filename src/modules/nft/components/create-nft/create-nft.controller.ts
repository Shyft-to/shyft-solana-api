import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Blob } from 'nft.storage';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { CreateNftService } from './create-nft.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { StorageMetadataService } from '../storage-metadata/storage-metadata.service';
import { CreateOpenApi } from './open-api';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class CreateNftController {
  constructor(
    private createNftService: CreateNftService,
    private storageService: StorageMetadataService,
  ) {}

  @CreateOpenApi()
  @Post('create')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async createNft(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNftDto: CreateNftDto,
  ): Promise<any> {
    const uploadImage = await this.storageService.uploadToIPFS(
      new Blob([file.buffer], { type: file.mimetype }),
    );
    const image = uploadImage.uri;
    const { uri } = await this.storageService.prepareMetaData({
      network: createNftDto.network,
      private_key: createNftDto.private_key,
      image,
      name: createNftDto.name,
      description: createNftDto.description,
      symbol: createNftDto.symbol,
      attributes: createNftDto.attributes,
      share: createNftDto.share,
      seller_fee_basis_points: createNftDto.seller_fee_basis_points,
      external_url: createNftDto.externalUrl,
    });
    const mintNftRequest = {
      network: createNftDto.network,
      private_key: createNftDto.private_key,
      metadata_uri: uri,
      max_supply: createNftDto.max_supply,
    };
    const nft = await this.createNftService.mintNft(mintNftRequest);
    return {
      success: true,
      message: 'NFT created successfully',
      result: nft,
    };
  }
}
