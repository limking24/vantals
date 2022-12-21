import { Listing } from 'vantals-common/src/models/listing';

export interface FilterOption {
	minPrice?: number,
	maxPrice?: number
}

export type OnMultiFetch = Promise<Listing[]>[];

export interface ListingCollector {
	collect: (option?: FilterOption) => Promise<Listing[]>
}

export function getMinPrice(filter?: FilterOption): number {
	return (filter && filter.minPrice) ? filter.minPrice : 1;
}

export function getMaxPrice(filter?: FilterOption): number | '' {
	return (filter && filter.maxPrice) ? filter.maxPrice : '';
}