import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, Req, Version } from '@nestjs/common';
import { SearchNftService } from './search-nft.service';
import { SearchNftDto } from './dto/search.dto';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class SearchNftcontroller {
	constructor(
		private searchNftService: SearchNftService
	) { }

	async searchNft(
		@Body() searchNftDto: SearchNftDto,
		@Req() request: any
	): Promise<any> {

	}
}