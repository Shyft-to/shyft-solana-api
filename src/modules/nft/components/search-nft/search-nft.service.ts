import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { NftInfoAccessor } from 'src/dal/nft-repo/nft-info.accessor';
import { getNftDbResponseFromNftInfo } from 'src/dal/nft-repo/nft-info.helper';

@Injectable()
export class SearchNftService {
	constructor(private nftInfoAccessor: NftInfoAccessor) { }
	async searchNftsByAttributes(query: any, apiKeyId: ObjectId): Promise<any> {
		const filter = {}
		for (const key in query) {
			const k = "attributes." + key;
			const n = parseInt(query[key])
			if (!isNaN(n)) {
				filter[k] = n
			} else {
				filter[k] = query[key];
			}
		}

		filter["api_key_id"] = apiKeyId;
		const filteredResult = await this.nftInfoAccessor.find(filter);
		const result = filteredResult.map(r => {
			return getNftDbResponseFromNftInfo(r);
		})

		return result;
	}
}