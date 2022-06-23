import { Injectable } from "@nestjs/common";
import { NftInfoAccessor } from "src/dal/nft-repo/nft-info.accessor";
import { QueryStringDto } from "./dto/query-string.dto"

@Injectable()
export class SearchNftService {
	constructor(private nftInfoAccessor: NftInfoAccessor) { }
	async searchNftsByAttributes(query: QueryStringDto): Promise<any> {
		const filter = {}
		for (let key in query) {
			console.log(query[key]);
			const k = "attributes." + key;
			const n = parseInt(query[key])
			if (!isNaN(n)) {
				filter[k] = n
			} else {
				filter[k] = query[key];
			}
		}

		const result = await this.nftInfoAccessor.find(filter);
		return result;
	}
}