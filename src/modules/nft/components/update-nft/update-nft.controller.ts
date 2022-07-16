import { Body, Controller, Put, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateNftDto } from './dto/update.dto';
import { UpdateNftService } from './update-nft.service';
import { Blob } from 'nft.storage';
import { StorageMetadataService } from '../storage-metadata/storage-metadata.service';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { UpdateOpenApi } from './open-api';
import { RemoteDataFetcherService } from 'src/modules/db/remote-data-fetcher/data-fetcher.service';
import { FetchNftDto } from 'src/modules/db/remote-data-fetcher/dto/data-fetcher.dto';
import { AccountUtils } from 'src/common/utils/account-utils';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class UpdateNftController {
  constructor(private updateNftService: UpdateNftService, private storageService: StorageMetadataService, private dataFetcher: RemoteDataFetcherService) {}

  @UpdateOpenApi()
  @Put('update')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateNftDto: UpdateNftDto,
  ): Promise<any> {
    const nftInfo = (
      await this.dataFetcher.fetchNft(
        new FetchNftDto(updateNftDto.network, updateNftDto.token_address),
      )
    ).getNftInfoDto();
    const uploadImage = await this.storageService.uploadToIPFS(new Blob([file.buffer], { type: file.mimetype }));
    const image = uploadImage.uri;
    //Tranform attributes
    const attr = [];
    Object.keys(updateNftDto.attributes).map((trait) => {
      attr.push({ trait_type: trait, value: updateNftDto.attributes[trait] });
    });

    const createParams = {
      network: updateNftDto.network,
      creator: AccountUtils.getKeypair(updateNftDto.private_key).publicKey.toBase58(),
      image,
      name: updateNftDto.name,
      description: updateNftDto.description,
      symbol: updateNftDto.symbol,
      attributes: attr,
      seller_fee_basis_points: updateNftDto.royalty,
      share: 100,
      external_url: nftInfo.external_url,
    };

    const { uri } = await this.storageService.prepareNFTMetadata(createParams);

    const res = await this.updateNftService.updateNft(uri, {
      ...updateNftDto,
      ...createParams,
      update_authority: nftInfo.update_authority,
      is_mutable: nftInfo.is_mutable,
      primary_sale_happened: nftInfo.primary_sale_happened,
    });
    return {
      success: true,
      message: 'NFT updated',
      result: res,
    };
  }
}
