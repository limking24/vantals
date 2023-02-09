import { ListingCollector, OnMultiFetch } from '../listing-collector/listing-collector';
import { flatten } from '../functional/array';
import { VanpeopleApi } from '../listing-collector/vanpeople-api';
import { VanskyCrawler } from '../listing-collector/vansky-crawler';
import allowCors from '../cors';
import { FilterOption } from 'vantals-common/src/models/listing';
import { CraigslistApi } from '../listing-collector/craigslist-api';

export default allowCors(async function handler(req, res) {
	const { minPrice, maxPrice } = req.query;
	const filter: FilterOption = { minPrice, maxPrice };
	let collectors: ListingCollector[] = [new CraigslistApi(),  new VanpeopleApi(), new VanskyCrawler()];
	let onFetch: OnMultiFetch = collectors.map(collector => collector.collect(filter));
	let json = flatten(await Promise.all(onFetch))
				.sort((a, b) => b.time.getTime() - a.time.getTime());
	res.status(200).json(json);
})