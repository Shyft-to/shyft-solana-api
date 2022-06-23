import { ObjectId } from "mongoose";
import { searchAttribute } from "./search.dto";

export class FindNftDto {
	constructor(apiKeyId: ObjectId, attr: searchAttribute[]) {
		this.apiKeyId = apiKeyId;
		this.attributes = attr;
	}

	readonly apiKeyId: ObjectId;

	readonly attributes: searchAttribute[];
}