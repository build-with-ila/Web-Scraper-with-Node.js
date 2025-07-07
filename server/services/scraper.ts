import axios from 'axios'
import * as cheerio from 'cheerio'
import {isReachable} from "./reachability"

interface ScrapedCompany {
  url: string;
  name?: string;
  email?: string;
  phone?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  error?: string;
}

interface AdData {
  sitelinks: string[];
}


export const scrapeFromSearch = async(query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return scrapeFromSeedUrls([searchUrl]);
}

export const scrapeFromSeedUrls = async (urls: string[]): Promise<ScrapedCompany[]> => {
    console.log("searchURLs: "+urls);
    const results: ScrapedCompany[] = [];

    const selectRandom = () => {
        const userAgents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36", ]
        var randomNumber = Math.floor(Math.random() * userAgents.length);
        return userAgents[randomNumber];
    }

     for (const url of urls) {
        const reachable = await isReachable(url);
        if(reachable) {
            try {                
                let user_agent = selectRandom();
                let userParams = {
                    timeout: 10000,
                    headers: {
                        'User-Agent': `${user_agent}`
                    }
                } 
                const { data: html } = await axios.get(url, userParams);
                //console.log("results- " + html);
            
            
                const $ = cheerio.load(html);
                const name = $('title').first().text().trim();
                const email = $('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '');
                const phone = $('a[href^="tel:"]').first().attr('href')?.replace('tel:', '');

                const socialLinks: ScrapedCompany['socials'] = {};

                $('a[href]').each((_, el) => {
                    const href = $(el).attr('href');

                    if (!href) return;

                    if (href.includes('twitter.com') && !socialLinks.twitter) {
                    socialLinks.twitter = href;
                    } else if (href.includes('linkedin.com') && !socialLinks.linkedin) {
                    socialLinks.linkedin = href;
                    } else if (href.includes('facebook.com') && !socialLinks.facebook) {
                    socialLinks.facebook = href;
                    } else if (href.includes('instagram.com') && !socialLinks.instagram) {
                    socialLinks.instagram = href;
                    }
                });
                        
                results.push({
                    url,
                    name,
                    email,
                    phone,
                    socials: Object.keys(socialLinks).length ? socialLinks : undefined
                });
                
                //----------------------------------------------------------------------//
                    /*let ads: AdData[] = [];
                    $("#tads .uEierd").each((i, el) => {
                        let sitelinks: any[] = [];*/
                    let ads: { sitelinks: any[]; }[] = [];
                    $("#tads .uEierd").each((i, el) => {
                        let sitelinks: any[] = [];
 
                        /*ads[i] = {
                            ads[i] = { sitelinks }
                            title: $(el).find(".v0nnCb span").text(),
                            snippet: $(el).find(".lyLwlc").text(),
                            displayed_link: $(el).find(".qzEoUe").text(),
                            link: $(el).find("a.sVXRqc").attr("href"),
                        }*/
                        if ($(el).find(".UBEOKe").length) {
                            $(el).find(".MhgNwc").each((i, el) => {
                                sitelinks.push({
                                    title: $(el).find("h3").text(),
                                    link: $(el).find("a").attr("href"),
                                    snippet: $(el).find(".lyLwlc").text()
                                })
                            });
                            ads[i].sitelinks = sitelinks
                        }
                    });
                    console.log(ads)
                //-----------------------------------------------------------------------//

            } catch (err: any) {
                results.push({
                    url,
                    error: `Failed to scrape: ${err.message}`
                });
            }
        }
        else {
            results.push({ url, error: 'Error connecting to this site' });
        }
  }
  console.log(results);
  return results;
};