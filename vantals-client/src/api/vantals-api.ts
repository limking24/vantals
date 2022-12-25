import { FilterOption, getMaxPrice, getMinPrice, Listing } from 'vantals-common/src/models/listing';

export class VantalsApi {

	private _listingsUrl: string;

	public constructor(private _baseUrl: string) {
		this._listingsUrl = _baseUrl + 'listings';
	}

	public async getListings(option?: FilterOption): Promise<Listing[]> {
		let response = await fetch(`${this._listingsUrl}?minPrice=${getMinPrice(option)}&maxPrice=${getMaxPrice(option)}`);
		let json = await response.json();
		let output: Listing[] = [];
		for (let i = 0; i < json.length; i++) {
			output.push( {
				title: json[i].title,
				photo: new URL(json[i].photo),
				hyperlink: new URL(json[i].hyperlink),
				description: json[i].description,
				location: json[i].location,
				time: new Date(json[i].time),
				price: json[i].price,
				source: json[i].source
			});
		}
		return output;
	}

}