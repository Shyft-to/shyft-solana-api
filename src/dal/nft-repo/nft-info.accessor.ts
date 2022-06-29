import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NftInfo, NftInfoDocument } from './nft-info.schema';

@Injectable()
export class NftInfoAccessor {
  constructor(@InjectModel(NftInfo.name) public NftInfoDataModel: Model<NftInfoDocument>) { }

  public async insert(data: NftInfo): Promise<any> {
    const result = await this.NftInfoDataModel.create(data);
    return result;
  }

  public async readNft(data: string): Promise<NftInfoDocument> {
    const result = await this.NftInfoDataModel.findOne({ mint: data });
    return result;
  }

  public async updateNft(data: NftInfo): Promise<any> {
    const filter = { mint: data.mint };
    const result = await this.NftInfoDataModel.updateOne(filter, data, {
      upsert: true,
    });
    return result;
  }

  public async find(filter: Object): Promise<NftInfoDocument[]> {
    try {
      const result = await this.NftInfoDataModel.find(filter)
      return result
    } catch (err) {
      console.log(err)
    }
    return []
  }

  public async updateManyNft(nfts: NftInfo[]): Promise<any> {
    try {
      await Promise.all(
        nfts.map(async (nft) => {
          const filter = { mint: nft.mint };
          await this.NftInfoDataModel.updateOne(filter, nft, { upsert: true });
        }),
      );
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  public async deleteNft(tokenAddress: string): Promise<any> {
    const filter = { mint: tokenAddress };
    const result = await this.NftInfoDataModel.deleteOne(filter);
    return result;
  }
}
