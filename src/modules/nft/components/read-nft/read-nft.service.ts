import { HttpException, Injectable } from '@nestjs/common';
import { ReadNftDto } from './dto/read-nft.dto';
import { ReadAllNftDto } from './dto/read-all-nft.dto';
import { nftHelper } from '../../nft.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NftReadEvent, NftReadInWalletEvent } from '../db-sync/events';
import { RemoteDataFetcherService } from '../remote-data-fetcher/data-fetcher.service';
import { NftInfoAccessor } from '../../../../dal/nft-repo/nft-info.accessor';
import { FetchAllNftDto, FetchNftDto } from '../remote-data-fetcher/dto/data-fetcher.dto';

@Injectable()
export class ReadNftService {
  constructor(private remoteDataFetcher: RemoteDataFetcherService, private nftInfoAccessor: NftInfoAccessor, private eventEmitter: EventEmitter2) {}
  async readAllNfts(readAllNftDto: ReadAllNftDto): Promise<any> {
    try {
      const { network, address } = readAllNftDto;
      const fetchAllNft = new FetchAllNftDto(network, address);
      const nftsmetadata = await this.remoteDataFetcher.fetchAllNfts(fetchAllNft);

      const nftReadInWalletEvent = new NftReadInWalletEvent(address, network);
      this.eventEmitter.emit('all.nfts.read', nftReadInWalletEvent);

      return nftsmetadata;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async readNft(readNftDto: ReadNftDto): Promise<any> {
    try {
      const { network, token_address } = readNftDto;
      const fetchNft = new FetchNftDto(network, token_address);
      const dbNftInfo = await this.nftInfoAccessor.readNft(readNftDto.token_address);
      let nftMeta = {};
      if (dbNftInfo) {
        nftMeta = {
          name: dbNftInfo.name,
          description: dbNftInfo.description,
          symbol: dbNftInfo.symbol,
          image: dbNftInfo.image_uri,
          attributes: dbNftInfo.attributes,
        };
      } else {
        const metadata = await this.remoteDataFetcher.fetchNft(fetchNft);
        nftMeta = nftHelper.parseMetadata(metadata.offChainMetadata);
      }

      //Trigger read event, to update DB
      const nftReadEvent = new NftReadEvent(token_address, network);
      this.eventEmitter.emit('nft.read', nftReadEvent);

      return nftMeta;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
