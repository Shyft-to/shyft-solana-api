import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    @Req() req: any
  ): Promise<any> {
    const uploadImage = await this.createNftService.uploadToIPFS(
      new Blob([file.buffer], { type: file.mimetype }),
    );
    const image = uploadImage.uri;
    console.log("image uploaded")
    const metaDataURI = await this.createNftService.prepareMetaData(
      createNftDto,
      image,
    );
    console.log("metadata uploaded")
    const nft = await this.createNftService.mintNft(createNftDto, metaDataURI);

    console.log("minted")
    this.createNftService.createNftInDb(createNftDto, metaDataURI, uploadImage, nft, req.user)
    console.log("db updated")
    return {
      success: true,
      message: 'NFT created successfully',
      result: nft,
    };
  }
}
