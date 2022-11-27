import { ListingCollector, OnMultiFetch } from '../listing-collector/listing-collector';
import { flatten } from '../functional/array';
import { CraigslistCrawler } from '../listing-collector/craigslist-crawler';
import { VanpeopleApi } from '../listing-collector/vanpeople-api';
import { VanskyCrawler } from '../listing-collector/vansky-crawler';

export default async function handler(req, res) {
	let collectors: ListingCollector[] = [new CraigslistCrawler(), new VanpeopleApi(), new VanskyCrawler()];
	let onFetch: OnMultiFetch = collectors.map(collector => collector.collect());
	let json = flatten(await Promise.all(onFetch))
				.sort((a, b) => b.time.getTime() - a.time.getTime());
	res.status(200).json(json);
}