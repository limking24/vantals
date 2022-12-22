import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { FilterOption, getMaxPrice, getMinPrice, Listing } from 'vantals-common/src/models/listing';
import { flatten } from '../functional/array';
import { ListingCollector, OnMultiFetch } from './listing-collector';

const source = 'vansky';
const baseUrl = 'https://www.vansky.com';
const infoUrl = baseUrl + '/info/';
const price = '';

const config = {
	baseUrl,
	infoUrl,
	searchPage: infoUrl + 'ZFBG08.html?findcid=ZFBG08&trad_type=900001&item_type=900101', //location=CITY01
};

export class VanskyCrawler implements ListingCollector {

	public constructor(private _noOfPages = 1, private _config = config) {}

	public async collect(option?: FilterOption): Promise<Listing[]> {
		const url = `${this._config.searchPage}&fprice1=${getMinPrice(option)}&fprice2=${getMaxPrice(option)}`
		let onFetch: OnMultiFetch = [...Array(this._noOfPages)].map((_, i) => {
			return fetch(url)
					.then(response => response.text())
					.then(html => {
						let $ = cheerio.load(html);
						let listings = $('div.tabbable .myrow .myrow:last-child table tbody tr[itemscope]').map((i, tr) => {
							let td = $(tr).find('td:nth-of-type(1)');
							let title = $(td).find('meta[itemprop=headline]').attr('content')!;
							let photo = new URL(baseUrl + $(td).find('meta[itemprop=image]').attr('content')!.replace(/\!.+$/, ''));
							let hyperlink = new URL(infoUrl + $(td).find('meta[itemprop=mainEntityOfPage]').attr('content'));
							let time = new Date($(td).find('meta[itemprop=datePublished]').attr('content')!);
							let description = $(tr).find('td:nth-of-type(2) div').text().trim();
							let location = $(tr).find('td:nth-of-type(3) div:nth-of-type(1)').text().trim();
							return {title, photo, hyperlink, time, description, location, price, source};
						});
						return listings.toArray();
					});
		});
		return flatten(await Promise.all(onFetch));
	}

}