export interface FilterOption {

}

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

export type OnMultiFetch = Promise<Listing[]>[];

export interface ListingCollector {
	collect: (option?: FilterOption) => Promise<Listing[]>
}