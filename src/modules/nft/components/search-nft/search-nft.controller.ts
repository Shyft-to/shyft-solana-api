import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, Version } from '@nestjs/common';
import { SearchNftService } from './search-nft.service';
import { blockParams } from 'handlebars';
import { query } from 'express';

@ApiTags('NFT')
@ApiSecurity('api_key', ['x-api-key'])
@Controller('nft')
export class SearchNftcontroller {
	constructor(
		private searchNftService: SearchNftService
	) { }

	@Get('search/attributes')
	@Version('1')
	async searchNft(
		@Query() query
	): Promise<any> {
		const result = await this.searchNftService.searchNftsByAttributes(query)
		return {
			success: true,
			message: "filtered NFTs",
			result: result,
		}
	}
}