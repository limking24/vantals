import fetch from 'node-fetch';
import { FilterOption, getMaxPrice, getMinPrice, Listing } from 'vantals-common/src/models/listing';
import { ListingCollector } from './listing-collector';

interface Response {
	data: {
		list: {
			title: string,
			cover: string,
			url: string,
			content: string,
			areaname: string,
			posttime: number,
			price: string
		}[]
	}
}

const source = 'vanpeople';
const baseUrl = 'https://c.vanpeople.com';
const ajaxUrl = baseUrl + '/ajax/pc/list.html';

const config = {
	baseUrl,
	ajaxUrl
}

export class VanpeopleApi implements ListingCollector {

	public constructor(private _config = config) {}
	
	public async collect(option?: FilterOption): Promise<Listing[]> {
		let response = await fetch(this._config.ajaxUrl, {
			method: 'POST', 
			body: `sortid=42&is_see_ad=0&tagid=0&is_see_private_car=0&vals[price]=${getMinPrice(option, 1)},${getMaxPrice(option)}`, //s_city=5
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		});
		let json = await response.json() as Response;
		return json.data.list.map((listing, i) => ({
			title: listing.title,
			photo: new URL(listing.cover == '' ? 'https://static.vancdn.com/van/public/img/nopic/nopic-small.png' : listing.cover),
			hyperlink: new URL(baseUrl + listing.url),
			description: listing.content,
			location: listing.areaname,
			time: new Date(listing.posttime * 1000),
			price: listing.price,
			source
		}));
	}
	
}