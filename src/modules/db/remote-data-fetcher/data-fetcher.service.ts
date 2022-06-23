import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Connection } from '@metaplex/js';
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import { HttpService } from '@nestjs/axios';
import { FetchNftDto, FetchAllNftDto, NftData } from './dto/data-fetcher.dto';

@Injectable()
export class RemoteDataFetcherService {
  constructor(private httpService: HttpService) {}
  async fetchAllNfts(fetchAllNftDto: FetchAllNftDto): Promise<MetadataData[]> {
    try {
      const { network, walletAddress } = fetchAllNftDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      if (!walletAddress) {
        throw new HttpException('Please provide any public or private key', HttpStatus.BAD_REQUEST);
      }
      const nfts = await Metadata.findDataByOwner(connection, walletAddress);
      return nfts;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async fetchAllNftDetails(fetchAllNftDto: FetchAllNftDto): Promise<NftData[]> {
    const onChainData = await this.fetchAllNfts(fetchAllNftDto);
    const result: NftData[] = [];
    for (const oncd of onChainData) {
      const ofcd = await this.getOffChainMetadata(oncd.data.uri);
      //No need to fetch owner, we have the wallet Id
      const owner = fetchAllNftDto.walletAddress;
      result.push(new NftData(oncd, ofcd.data, owner));
    }

    return result;
  }

  async fetchOwner(fetchNftDto: FetchNftDto): Promise<string> {
    try {
      const { network, tokenAddress } = fetchNftDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      if (!tokenAddress) {
        throw new HttpException('Please provide any public or private key', HttpStatus.BAD_REQUEST);
      }
      const largestAcc = await connection.getTokenLargestAccounts(new PublicKey(tokenAddress));
      const ownerInfo = <any>await connection.getParsedAccountInfo(largestAcc?.value[0]?.address);

      return ownerInfo.value?.data?.parsed?.info?.owner;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  //Fetches Nft 's onchain and off chain metadata + owner
  async fetchNftDetails(fetchNftDto: FetchNftDto): Promise<NftData> {
    try {
      if (!fetchNftDto.tokenAddress) {
        throw new HttpException('Please provide any public or private key', HttpStatus.BAD_REQUEST);
      }
      const nftData = await this.fetchNft(fetchNftDto);
      nftData.owner = await this.fetchOwner(fetchNftDto);

      return nftData;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async fetchNft(fetchNftDto: FetchNftDto): Promise<NftData> {
    try {
      const { network, tokenAddress } = fetchNftDto;
      const connection = new Connection(clusterApiUrl(network), 'confirmed');
      if (!tokenAddress) {
        throw new HttpException('Please provide any public or private key', HttpStatus.BAD_REQUEST);
      }
      const pda = await Metadata.getPDA(new PublicKey(tokenAddress));
      const metadata = await Metadata.load(connection, pda);

      const uriRes = await this.getOffChainMetadata(metadata.data.data.uri);

      if (!metadata) {
        throw new HttpException("Maybe you've lost", HttpStatus.NOT_FOUND);
      }

      const retObj = new NftData(metadata.data, uriRes.data);
      return retObj;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  private async getOffChainMetadata(uri: string): Promise<any> {
    const uriRes = await this.httpService.get(uri).toPromise();
    if (uriRes.status != 200) {
      throw new HttpException('Incorrect URI path', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return uriRes;
  }
}
