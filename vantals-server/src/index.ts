import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { flatten } from './functional/array';
import { CraigslistCrawler } from './listing-collector/craigslist-crawler';
import { ListingCollector, OnMultiFetch } from './listing-collector/listing-collector';
import { VanpeopleApi } from './listing-collector/vanpeople-api';
import { VanskyCrawler } from './listing-collector/vansky-crawler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let collectors: ListingCollector[] = [new CraigslistCrawler(), new VanpeopleApi(), new VanskyCrawler()];

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || '');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	next();
});

app.get('/listings', async (req: Request, res: Response) => {
	let onFetch: OnMultiFetch = collectors.map(collector => collector.collect());
	res.json(flatten(await Promise.all(onFetch))
				.sort((a, b) => b.time.getTime() - a.time.getTime()));
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});