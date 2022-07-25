import { Body, Controller, Post, Req, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
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
  constructor(private createNftService: CreateNftService, private storageService: StorageMetadataService) { }

  @CreateOpenApi()
  @Post('create')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async createNft(@UploadedFile() file: Express.Multer.File, @Body() createNftDto: CreateNftDto, @Req() request: any): Promise<any> {
    const uploadImage = await this.storageService.uploadToIPFS(new Blob([file.buffer], { type: file.mimetype }));
    const image = uploadImage.uri;

    const { uri } = await this.storageService.prepareNFTMetadata({
      network: createNftDto.network,
      creator: createNftDto.address,
      image,
      name: createNftDto.name,
      description: createNftDto.description,
      symbol: createNftDto.symbol,
      attributes: createNftDto.attributes,
      share: 100, //keeping it 100 by default for now createNftDto.share,
      royalty: createNftDto.royalty ?? 0, //500 = 5%
      external_url: createNftDto.external_url,
    });

    const mintNftRequest = {
      network: createNftDto.network,
      name: createNftDto.name,
      symbol: createNftDto.symbol,
      address: createNftDto.address,
      metadataUri: uri,
      maxSupply: createNftDto.max_supply,
      royalty: createNftDto.royalty,
      userId: request.id,
    };

    const encoded_transaction = await this.createNftService.mintNft(mintNftRequest);

    return {
      success: true,
      message: 'NFT mint request generated successfully',
      result: { encoded_transaction },
    };
  }
}
