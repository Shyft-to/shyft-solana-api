import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SearchNftDto {
	@IsNotEmpty()
	@ApiProperty({
		title: 'attributes',
		type: String,
		description: 'searchable NFT attributes',
		example: [
			{ name: 'edification', value: 100, operator: ">=" },
			{ name: 'loudness', value: "high" },
			{ name: 'energy', value: 100, operator: "==" },
		],
	})
	readonly attributes: {
		name: string;
		operator: string;
		value: string | number;
	}[];
}