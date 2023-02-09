import { FilterOption, getMaxPrice, getMinPrice, Listing } from 'vantals-common/src/models/listing';
import { ListingCollector } from './listing-collector';

interface Response {
	data: {
		decode: {
			minPostedDate: number;
			minPostingId: number;
		}
		items: any[][];
	}
}

export class CraigslistApi implements ListingCollector {

	public async collect(option?: FilterOption): Promise<Listing[]> {
		let response = await fetch(`https://sapi.craigslist.org/web/v7/postings/search/full?batch=16-0-360-0-0&cc=US&lang=en&min_price=${getMinPrice(option)}&max_price=${getMaxPrice(option)}&searchPath=apa`);
		let json = await response.json() as Response;
		let minPostingId = json.data.decode.minPostingId;
		return json.data.items.map((item, i) => {
			let id = minPostingId + item[0];
			let timestamp = (json.data.decode.minPostedDate + item[1]) * 1000;
			let price = `${item[3]}`;
			let title: string;
			let photo: string | undefined;
			let bedroom: number | undefined;
			let sqft: number | undefined;
			let path: string;

			for (let x = 5; x < item.length; x++) {
				if (typeof item[x] == 'string') {
					title = item[x];
				} else if (Array.isArray(item[x])) {
					let identifier = item[x][0];
					if (identifier == 4) {
						photo = item[x][1].substring(2);
					} else if (identifier == 5) {
						bedroom = item[x][1];
						sqft = item[x][2];
					} else if (identifier == 6) {
						path = item[x][1];
					}
				}
			}

			return {
				title: title!,
				photo: new URL(photo != undefined ? `https://images.craigslist.org/${photo}_600x450.jpg` : 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'),
				hyperlink: new URL(`https://vancouver.craigslist.org/van/apa/d/${path!}/${id}.html`),
				description: `${bedroom == undefined ? '' : bedroom + 'br'} ${sqft == undefined ? '' : sqft + 'sf'}`,
				location: '',
				time: new Date(timestamp),
				price,
				source: 'craigslist'
			}
		});
	}

}