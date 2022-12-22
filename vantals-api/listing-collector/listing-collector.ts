import { FilterOption, Listing } from 'vantals-common/src/models/listing';

export type OnMultiFetch = Promise<Listing[]>[];

export interface ListingCollector {
	collect: (option?: FilterOption) => Promise<Listing[]>
}