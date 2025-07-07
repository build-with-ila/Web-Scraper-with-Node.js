import express, {Router, Request, Response} from "express";
import {scrapeFromSearch, scrapeFromSeedUrls} from "../services/scraper"

const router: Router = express.Router();

interface ScrapeRequest {
    query?: string,
    urls?: string[];
}

router.post("/scrape", async(req: Request<{}, {}, ScrapeRequest>, res: Response): Promise<void> => {
    const {query, urls} = req.body;
    if(query) {
        const results = await scrapeFromSearch(query);
        res.json(results);
    }
    else if(Array.isArray(urls) && urls.length > 0) {
        const results = await scrapeFromSeedUrls(urls);
        res.json(results);
    }
    else {
        res.status(400).json({error: "Provide either a Search Query or Seed URLs."});
        return;
    }
});

export default router;