import axios from "axios"
import * as cheerio from "cheerio"
import {isReachable} from "./reachability"

export const scrapeFromSearch = async(query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    //console.log(searchUrl);
    return scrapeFromSeedUrls([searchUrl]);
}

export const scrapeFromSeedUrls = async(urls: string[]) => {
    console.log("searchURLs: "+urls);
    const results: any[] = [];

    for(const url of urls) {
        const reachable = await isReachable(url);
        if(reachable) {
            try {
                //const reachable = await isReachable(url);
                const res = await axios.get(url, {
                    headers:{
                        'User-Agent' : 'Mozilla 5.0 WebScraperBot/1.0'
                    }
                });

                const $ = cheerio.load(res.data);
                const companyName = $('title').text().trim();
                const email = $('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '');
                const phone = $('a[href^="tel:"]').first().attr('href')?.replace('tel:', '');
                const description = $('meta[name="description"]').attr('content');

                results.push({ url, name: companyName, email, phone, description });
            }
            catch (err: any){
                results.push({ url, error: err.message || 'Error scraping this site' });
            }
        }
        else {
            results.push({ url, error: 'Error connecting to this site' });
        }
    }
    console.log(results);
    return results;
}