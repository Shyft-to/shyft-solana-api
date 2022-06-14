import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicKey } from '@solana/web3.js';
import { Blob } from 'nft.storage';
import { CreateNftService } from './create-nft.service';
import { CreateNftDto } from './dto/create-nft.dto';


@Controller('nft')
export class CreateNftController {
  constructor(private createNftService: CreateNftService) { }
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async createNft(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNftDto: CreateNftDto,
  ): Promise<any> {
    const uploadImage = await this.createNftService.uploadToIPFS(
      new Blob([file.buffer], { type: file.mimetype }),
    );
    const image = uploadImage.uri;
    const metaDataURI = await this.createNftService.prepareMetaData(
      createNftDto,
      image,
    );
    const nft = await this.createNftService.mintNft(createNftDto, metaDataURI);

    this.createNftService.updateNftInDb(createNftDto, metaDataURI, uploadImage, nft)

    return {
      success: true,
      message: 'NFT created successfully',
      result: nft,
    };
  }
}
