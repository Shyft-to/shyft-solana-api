import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, Req, Version } from '@nestjs/common';
import { SearchNftService } from './search-nft.service';
import { SearchNftDto } from './dto/search.dto';
import { FindNftDto } from './dto/filter-nft.dto';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class SearchNftcontroller {
	constructor(
		private searchNftService: SearchNftService
	) { }

	@Post('search')
	@Version('1')
	async searchNft(
		@Body() searchNftDto: SearchNftDto,
		@Req() request: any
	): Promise<any> {

		const filterNftRequest = new FindNftDto(request.id, searchNftDto.attributes)
		const result = await this.searchNftService.filterNfts(filterNftRequest)
		return {
			success: true,
			message: "filtered NFTs",
			result: result,
		}

	}
}