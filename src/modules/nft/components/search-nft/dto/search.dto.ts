import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class searchAttribute {
	readonly name: string;
	readonly operator: string;
	readonly value: string | number;
}

export class SearchNftDto {
	@IsNotEmpty()
	@ApiProperty({
		title: 'attributes',
		type: searchAttribute,
		description: 'searchable NFT attributes',
		example: [
			{ name: 'edification', value: 100, operator: ">=" },
			{ name: 'loudness', value: "high" },
			{ name: 'energy', value: 100, operator: "==" },
		],
	})
	readonly attributes: searchAttribute[];
}