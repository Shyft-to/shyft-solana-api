import { Body, Controller, Post, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Blob } from 'nft.storage';
import { StorageUploadOpenApi, MetadataCreateOpenApi } from './open-api';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { StorageMetadataService } from './storage-metadata.service';

@ApiSecurity('api_key', ['x-api-key'])
@Controller()
export class StorageMetadataController {
  constructor(private readonly storageMetadataService: StorageMetadataService) {}

  @StorageUploadOpenApi()
  @Post('storage/upload')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const uploadResponse = await this.storageMetadataService.uploadToIPFS(new Blob([file.buffer], { type: file.mimetype }));
    return {
      success: true,
      message: 'File uploaded successfully',
      result: uploadResponse,
    };
  }

  @MetadataCreateOpenApi()
  @Post('metadata/create')
  @Version('1')
  async createMetadata(@Body() createMetadataDto: CreateMetadataDto): Promise<any> {
    const metadata = await this.storageMetadataService.prepareMetaData(createMetadataDto);
    return {
      success: true,
      message: 'Metadata created successfully',
      result: metadata,
    };
  }
}
