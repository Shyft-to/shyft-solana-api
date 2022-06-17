import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Connection } from '@metaplex/js';
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import { HttpService } from '@nestjs/axios';
import { FetchNftDto, FetchAllNftDto, NftData } from './dto/data-fetcher.dto';

@Injectable()
export class RemoteDataFetcherService {

    constructor(private httpService: HttpService) { }
    async fetchAllNfts(fetchAllNftDto: FetchAllNftDto): Promise<MetadataData[]> {
        try {
            const { network, walletAddress } = fetchAllNftDto;
            const connection = new Connection(clusterApiUrl(network), 'confirmed');
            if (!walletAddress) {
                throw new HttpException(
                    'Please provide any public or private key',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const nftsmetadata = await Metadata.findDataByOwner(connection, walletAddress);
            return nftsmetadata;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    async fetchAllNftsMetadata(fetchAllNftDto: FetchAllNftDto): Promise<NftData[]> {
        let onChainData = await this.fetchAllNfts(fetchAllNftDto)
        let result: NftData[] = []

        for (let oncd of onChainData) {
            let ofcd = await this.getOffChainMetadata(oncd.data.uri)
            result.push(new NftData(oncd, ofcd.data))
        }

        return result
    }

    async fetchNft(fetchNftDto: FetchNftDto): Promise<NftData> {
        try {
            const { network, tokenAddress } = fetchNftDto;
            const connection = new Connection(clusterApiUrl(network), 'confirmed');
            if (!tokenAddress) {
                throw new HttpException(
                    'Please provide any public or private key',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const pda = await Metadata.getPDA(new PublicKey(tokenAddress));
            const metadata = await Metadata.load(connection, pda);

            const uriRes = await this.getOffChainMetadata(metadata.data.data.uri);

            if (!metadata) {
                throw new HttpException("Maybe you've lost", HttpStatus.NOT_FOUND);
            }

            let retObj = new NftData(metadata.data, uriRes.data)
            return retObj;
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    private async getOffChainMetadata(uri: string): Promise<any> {
        const uriRes = await this.httpService.get(uri).toPromise();
        if (uriRes.status != 200) {
            throw new HttpException("Incorrect URI path", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return uriRes;
    }
}
