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