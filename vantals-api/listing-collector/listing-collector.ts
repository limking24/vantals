import { Listing } from 'vantals-common/src/models/listing';

export interface FilterOption {

}

export type OnMultiFetch = Promise<Listing[]>[];

export interface ListingCollector {
	collect: (option?: FilterOption) => Promise<Listing[]>
}