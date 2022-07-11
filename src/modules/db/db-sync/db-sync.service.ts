import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NftInfoAccessor } from 'src/dal/nft-repo/nft-info.accessor';
import { NftInfo } from 'src/dal/nft-repo/nft-info.schema';
import { RemoteDataFetcherService } from '../remote-data-fetcher/data-fetcher.service';
import { FetchNftDto, FetchAllNftDto } from '../remote-data-fetcher/dto/data-fetcher.dto';
import { NftCreationEvent, NftDeleteEvent, NftReadEvent, NftReadInWalletEvent, NftUpdateEvent } from './db.events';

const afterNftCreationWaitTime_ms = 5000;

@Injectable()
export class DbSyncService {
  constructor(private remoteDataFetcher: RemoteDataFetcherService, private nftInfoAccessor: NftInfoAccessor) {}

  @OnEvent('nft.created', { async: true })
  async handleNftCreatedEvent(event: NftCreationEvent): Promise<any> {
    try {
      // it takes some time to newly created data on blockchain to be available for read
      setTimeout(async () => {
        const nftDbDto: NftInfo = await this.prepareNftDbDto(event);
        nftDbDto.api_key_id = event.apiKeyId;
        await this.nftInfoAccessor.insert(nftDbDto);
      }, afterNftCreationWaitTime_ms);
    } catch (err) {
      throw new Error(err);
    }
  }

  @OnEvent('nft.read', { async: true })
  async handleNftReadEvent(event: NftReadEvent): Promise<any> {
    try {
      await this.syncNftData(event);
    } catch (error) {
      throw error;
    }
  }

  @OnEvent('all.nfts.read', { async: true })
  async handleAllNftReadEvent(event: NftReadInWalletEvent): Promise<any> {
    try {
      const nfts = await this.remoteDataFetcher.fetchAllNftDetails(new FetchAllNftDto(event.network, event.walletAddress, event.updateAuthority));
      const nftInfos: NftInfo[] = nfts?.map((nft) => {
        const info = nft?.getNftInfoDto();
        info.network = event.network;
        info.owner = event.walletAddress;
        return info;
      });
      await this.nftInfoAccessor.updateManyNft(nftInfos);
    } catch (err) {
      console.error(err);
    }
  }

  @OnEvent('nft.updated', { async: true })
  async handleUpdateNftEvent(event: NftUpdateEvent): Promise<any> {
    try {
      await this.syncNftData(event);
    } catch (err) {
      console.error(err);
    }
  }

  @OnEvent('nft.deleted', { async: true })
  async handleDeleteNftEvent(event: NftDeleteEvent) {
    try {
      const result = await this.nftInfoAccessor.deleteNft(event.tokenAddress);
      return result;
    } catch (err) {
      throw Error(err);
    }
  }

  private async syncNftData(event: NftReadEvent): Promise<any> {
    try {
      const nftDbDto = await this.prepareNftDbDto(event);
      const result = await this.nftInfoAccessor.updateNft(nftDbDto);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  private async prepareNftDbDto(event: NftReadEvent) {
    try {
      const nftData = await this.remoteDataFetcher.fetchNftDetails(new FetchNftDto(event.network, event.tokenAddress));
      const nftDbDto = nftData.getNftInfoDto();
      nftDbDto.network = event.network;
      return nftDbDto;
    } catch (error) {
      throw Error(error);
    }
  }
}
