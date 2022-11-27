import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { Listing } from 'vantals-common/src/models/listing';
import { flatten } from '../functional/array';
import { FilterOption, ListingCollector, OnMultiFetch } from './listing-collector';

const source = 'vansky';
const baseUrl = 'https://www.vansky.com';
const infoUrl = baseUrl + '/info/';
const price = '';

const config = {
	baseUrl,
	infoUrl,
	searchPage: infoUrl + 'ZFBG08.html?location=CITY01&fprice2=1800',
};

export class VanskyCrawler implements ListingCollector {

	public constructor(private _noOfPages = 1, private _config = config) {}

	public async collect(option?: FilterOption): Promise<Listing[]> {
		let onFetch: OnMultiFetch = [...Array(this._noOfPages)].map((_, i) => {
			return fetch(this._config.searchPage)
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