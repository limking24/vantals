import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { FilterOption, Listing } from 'vantals-common/src/models/listing';
import { flatten } from '../functional/array';
import { getMaxPrice, getMinPrice, ListingCollector, OnMultiFetch } from './listing-collector';

const source = 'craigslist';
const baseUrl = 'https://vancouver.craigslist.org';
const searchDir = baseUrl + '/search/'; //van/
const houseForRentUrl = searchDir + 'apa?availabilityMode=0&sale_date=all+dates';

const config = {
	baseUrl,
	houseForRentUrl
}

export class CraigslistCrawler implements ListingCollector {

	public constructor(private _noOfPages = 1, private _config = config) {}

	public async collect(option?: FilterOption): Promise<Listing[]> {
		const url = config.houseForRentUrl + `&min_price=${getMinPrice(option)}&max_price=${getMaxPrice(option)}`;
		let onFetch: OnMultiFetch = [...Array(this._noOfPages)].map((_, i) => {
			return fetch(`${url}&s=${i * 120}`)
					.then(response => response.text())
					.then(html => {
						let $ = cheerio.load(html);
						let listings = $('#search-results li').map((i, li) => {
							let resultTitle = $(li).find('.result-title');
							let img = $(li).find('img').attr('src');
							let title = resultTitle.text().trim();
							let photo = new URL(img ? img.replace(/50x50c/, '600x450') : 'https://www.craigslist.org/images/peace.jpg');
							let hyperlink = new URL(resultTitle.attr('href')!);
							let time = new Date($(li).find('.result-date').attr('datetime')! + " GMT-8");
							let description = $(li).find('.housing').text().trim();
							let location = $(li).find('.result-hood').text().trim().slice(1, -1);
							let price = $(li).find('.result-price').first().text().trim().substring(1);
							return {title, photo, hyperlink, time, description, location, price, source};
						});
						return listings.toArray();
					});
		});
		return flatten(await Promise.all(onFetch));;
	}

}
