import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NftInfoAccessor } from 'src/dal/nft-repo/nft-info.accessor';
import { NftInfo } from 'src/dal/nft-repo/nft-info.schema';
import { RemoteDataFetcherService } from '../remote-data-fetcher/data-fetcher.service';
import {
    FetchNftDto,
    FetchAllNftDto,
} from '../remote-data-fetcher/dto/data-fetcher.dto';
import {
    NftCreationEvent,
    NftDeleteEvent,
    NftReadEvent,
    NftReadInWalletEvent,
    NftUpdateEvent,
} from './events';

const afterNftCreationWaitTime_ms = 5000;

@Injectable()
export class NftOperationsEventListener {
    constructor(
        private remoteDataFetcher: RemoteDataFetcherService,
        private nftInfoAccessor: NftInfoAccessor,
    ) { }

    @OnEvent('nft.created')
    handleNftCreatedEvent(event: NftCreationEvent) {
        // it takes some time to newly created data on blockchain to be available for read
        this.delay(afterNftCreationWaitTime_ms).then(() => {
            this.remoteDataFetcher
                .fetchNft(new FetchNftDto(event.network, event.tokenAddress))
                .then((metadata) => {
                    const nftDbDto = metadata.getNftInfoDto();
                    nftDbDto.chain = event.network;
                    return nftDbDto;
                })
                .then((nftDbDto) => {
                    nftDbDto.api_key_id = event.apiKeyId;
                    return this.nftInfoAccessor.insert(nftDbDto);
                })
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    @OnEvent('nft.read')
    handleNftReadEvent(event: NftReadEvent) {
        this.syncNftData(event);
    }

    @OnEvent('all.nfts.read')
    handleAllNftReadEvent(event: NftReadInWalletEvent) {
        this.remoteDataFetcher
            .fetchAllNftsMetadata(
                new FetchAllNftDto(event.network, event.walletAddress),
            )
            .then((nfts) => {
                let nftInfos: NftInfo[] = [];
                nftInfos = nfts.map((nft) => {
                    const info = nft.getNftInfoDto();
                    info.chain = event.network;
                    return info;
                });

                return nftInfos;
            })
            .then((nftInfos) => {
                return this.nftInfoAccessor.updateManyNft(nftInfos);
            })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    @OnEvent('nft.updated')
    handleUpdateNftEvent(event: NftUpdateEvent) {
        this.delay(afterNftCreationWaitTime_ms).then(() => {
            this.syncNftData(event);
        });
    }

    @OnEvent('nft.deleted')
    handleDeleteNftEvent(event: NftDeleteEvent) {
        this.nftInfoAccessor
            .deleteNft(event.tokenAddress)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    private syncNftData(event: NftReadEvent) {
        this.remoteDataFetcher
            .fetchNft(new FetchNftDto(event.network, event.tokenAddress))
            .then((metadata) => {
                const nftDbDto = metadata.getNftInfoDto();
                nftDbDto.chain = event.network;
                return nftDbDto;
            })
            .then((nftDbDto) => {
                return this.nftInfoAccessor.updateNft(nftDbDto);
            })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
