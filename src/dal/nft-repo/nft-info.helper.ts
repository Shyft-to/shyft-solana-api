import { NftDbResponse } from "src/modules/db/remote-data-fetcher/dto/data-fetcher.dto";
import { NftInfoDocument } from "./nft-info.schema";

export function getNftDbResponseFromNftInfo(r: NftInfoDocument): NftDbResponse {
	const response = {
		name: r.name,
		symbol: r.symbol,
		royalty: r.royalty,
		image_uri: r.image_uri,
		description: r.description,
		mint: r.mint,
		owner: r.owner,
		attributes: r.attributes,
	}
	return response;
}