import { HttpException, Injectable } from '@nestjs/common';
import { ReadNftDto } from './dto/read-nft.dto';
import { ReadAllNftDto } from './dto/read-all-nft.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NftReadEvent, NftReadInWalletEvent } from '../../../db/db-sync/db.events';
import { RemoteDataFetcherService } from '../../../db/remote-data-fetcher/data-fetcher.service';
import { NftInfoAccessor } from '../../../../dal/nft-repo/nft-info.accessor';
import { FetchAllNftDto, FetchNftDto, NftDbResponse } from '../../../db/remote-data-fetcher/dto/data-fetcher.dto';

@Injectable()
export class ReadNftService {
  constructor(private remoteDataFetcher: RemoteDataFetcherService, private nftInfoAccessor: NftInfoAccessor, private eventEmitter: EventEmitter2) {}

  async readAllNfts(readAllNftDto: ReadAllNftDto): Promise<any> {
    try {
      const { network, address, update_authority } = readAllNftDto;
      const fetchAllNft = new FetchAllNftDto(network, address, update_authority);

      const dbFilter = { owner: address, network: network };

      if (update_authority) {
        dbFilter['update_authority'] = update_authority;
      }

      const dbNftInfo = await this.nftInfoAccessor.find(dbFilter);

      const nftReadInWalletEvent = new NftReadInWalletEvent(address, network, update_authority);
      this.eventEmitter.emit('all.nfts.read', nftReadInWalletEvent);

      if (dbNftInfo.length) {
        return dbNftInfo.map((nft) => {
          return {
            name: nft.name,
            description: nft.description,
            symbol: nft.symbol,
            image_uri: nft.image_uri,
            attributes: nft.attributes,
            royalty: nft.royalty,
            mint: nft.mint,
            owner: nft.owner,
          };
        });
      } else {
        //not available in DB, fetch from blockchain
        const chainNfts = await this.remoteDataFetcher.fetchAllNftDetails(fetchAllNft);
        return chainNfts?.map((nft) => nft.getNftDbResponse());
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async readNft(readNftDto: ReadNftDto): Promise<NftDbResponse> {
    try {
      const { network, token_address } = readNftDto;
      const fetchNft = new FetchNftDto(network, token_address);
      const dbNftInfo = await this.nftInfoAccessor.readNft(readNftDto.token_address);

      //Trigger read event, to update DB (to-do:can be skipped)
      const nftReadEvent = new NftReadEvent(token_address, network);
      this.eventEmitter.emit('nft.read', nftReadEvent);

      if (dbNftInfo) {
        return {
          name: dbNftInfo.name,
          description: dbNftInfo.description,
          symbol: dbNftInfo.symbol,
          image_uri: dbNftInfo.image_uri,
          attributes: dbNftInfo.attributes,
          royalty: dbNftInfo.royalty,
          mint: dbNftInfo.mint,
          owner: dbNftInfo.owner,
        };
      } else {
        //not available in DB, fetch from blockchain
        return (await this.remoteDataFetcher.fetchNftDetails(fetchNft)).getNftDbResponse();
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
