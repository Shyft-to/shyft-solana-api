import { Body, Controller, Post, Req, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Blob } from 'nft.storage';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { CreateNftService } from './create-nft.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { StorageMetadataService } from '../storage-metadata/storage-metadata.service';
import { CreateOpenApi } from './open-api';
import { AccountUtils } from 'src/common/utils/account-utils';

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
    const creator = AccountUtils.getKeypair(createNftDto.private_key).publicKey.toBase58();

    const { uri } = await this.storageService.prepareNFTMetadata({
      network: createNftDto.network,
      creator: creator,
      image,
      name: createNftDto.name,
      description: createNftDto.description,
      symbol: createNftDto.symbol,
      attributes: createNftDto.attributes,
      share: 100, //keeping it 100 by default for now createNftDto.share,
      royalty: createNftDto.royalty, //500 = 5%
      external_url: createNftDto.external_url,
    });

    const mintNftRequest = {
      network: createNftDto.network,
      privateKey: createNftDto.private_key,
      metadataUri: uri,
      maxSupply: createNftDto.max_supply,
      userId: request.id,
    };

    const nft = await this.createNftService.mintNft(mintNftRequest);
    return {
      success: true,
      message: 'NFT created successfully',
      result: nft,
    };
  }
}
