export interface Listing {
	title: string,
	photo: URL,
	hyperlink: URL,
	description: string,
	location: string,
	time: Date,
	price: string,
	source: string
}

export interface FilterOption {
	minPrice?: number,
	maxPrice?: number
}

export function getMinPrice(filter?: FilterOption): number {
	return (filter && filter.minPrice) ? filter.minPrice : 1;
}

export function getMaxPrice(filter?: FilterOption): number | '' {
	return (filter && filter.maxPrice) ? filter.maxPrice : '';
}