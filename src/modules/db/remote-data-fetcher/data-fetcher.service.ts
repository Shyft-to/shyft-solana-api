import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Connection } from '@metaplex/js';
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata-depricated';
import { FetchNftDto, FetchAllNftDto, NftData } from './dto/data-fetcher.dto';
import { Utility } from 'src/common/utils/utils';

@Injectable()
export class RemoteDataFetcherService {
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
    let nfts = await this.fetchAllNfts(fetchAllNftDto);
    //Filter based on updateAuthority if any
    if (fetchAllNftDto.updateAuthority) {
      nfts = nfts.filter((nft) => {
        return nft.updateAuthority === fetchAllNftDto.updateAuthority;
      });
    }

    const result: NftData[] = [];

    //Run all offchain requests parallely instead of one by one
    const promises: Promise<NftData>[] = [];
    for (const oncd of nfts) {
      try {
        promises.push(Utility.request(oncd.data.uri));
        //No need to fetch owner, we have the wallet Id
        const owner = fetchAllNftDto.walletAddress;
        result.push(new NftData(oncd, null, owner));
      } catch (error) {
        //Ignore off chain data that cant be fetched or is taking too long.
        console.log('ignoring');
      }
    }

    const res = await Promise.allSettled(promises);

    res?.forEach((data, i) => {
      result[i].offChainMetadata = data.status === 'fulfilled' ? data.value : {};
    });
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
      console.log(error.message);
      throw new HttpException(error.message, error.status);
    }
  }

  //Fetches Nft's onchain and off chain metadata + owner
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
      let uriRes = {};

      try {
        uriRes = await Utility.request(metadata.data.data.uri);
      } catch (error) {
        console.log(error);
      }

      if (!metadata) {
        throw new HttpException("Maybe you've lost", HttpStatus.NOT_FOUND);
      }

      const retObj = new NftData(metadata.data, uriRes);
      return retObj;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
