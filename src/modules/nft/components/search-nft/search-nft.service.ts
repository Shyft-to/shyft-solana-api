import { Injectable } from "@nestjs/common";
import { NftInfoAccessor } from "src/dal/nft-repo/nft-info.accessor";
import { FindNftDto } from "./dto/filter-nft.dto";

@Injectable()
export class SearchNftService {
	constructor(private nftInfoAccessor: NftInfoAccessor) { }
	async filterNfts(filterNftRequest: FindNftDto): Promise<any> {
	}
}