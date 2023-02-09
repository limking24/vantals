import { FilterOption, getMaxPrice, getMinPrice, Listing } from 'vantals-common/src/models/listing';
import { ListingCollector } from './listing-collector';

interface Response {
	data: {
		decode: {
			locations: [number, [number, string, string][]];
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
			let photos;
			switch (item.length) {
				case 8: photos = -1; break;
				case 9: photos = 5; break;
				case 10: photos = 6; break;
			}
			let hrefInfo = (photos == -1) ? 5 : photos + 1;
			let title = hrefInfo + 1;
			let houseInfo = title + 1;
			let location = json.data.decode.locations[item[hrefInfo][0]][2];
			let bedroom = item[houseInfo][1];
			let sqft = item[houseInfo][2];
			return {
				title: item[title],
				photo: new URL(photos > 0 ? `https://images.craigslist.org/${item[photos][1].substring(2)}_600x450.jpg` : 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'),
				hyperlink: new URL(`https://vancouver.craigslist.org/${location}/apa/d/${item[hrefInfo][1]}/${minPostingId + item[0]}.html`),
				description: `${bedroom == 0 ? '' : bedroom + 'br'} ${sqft == 0 ? '' : sqft + 'sf'}`,
				location,
				time: new Date((json.data.decode.minPostedDate + item[1]) * 1000),
				price: `${item[3]}`,
				source: 'craigslist'
			}
		});
	}

}