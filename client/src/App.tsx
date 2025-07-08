import { useState } from 'react'
import type { ScrapedCompany } from './types/scraper';
import {scrapeCompanies} from "./services/api"
import ScrapeForm from "./components/ScrapeForm"
import './App.css'


function App() {
  const [query, setQuery] = useState("");
  const [urls, setUrls] = useState("");
  const [results, setResults] = useState<ScrapedCompany[]>([]);


  const isValidUrl = (url: string): boolean => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)' +                  // protocol
      '(([\\w-]+\\.)+[\\w-]{2,})' +         // domain
      '(\\:\\d+)?' +                        // port (optional)
      '(\\/\\S*)?$',                        // path (optional)
      'i'
    );
    return pattern.test(url);
  };
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    const rawUrls = urls.split('\n').map((u) => u.trim()).filter(Boolean);

    const invalidUrls = rawUrls.filter((url) => !isValidUrl(url));
    if (invalidUrls.length > 0) {
    alert(`These URLs are invalid:\n${invalidUrls.join('\n')}`);
    return;
    }

    const payload: any = {};
    if (query) payload.query = query;
    if (rawUrls.length) payload.urls = rawUrls;    
    try {
      //console.log(payload);
        const response = await scrapeCompanies(payload);
        setResults(response);
    }
    catch(err) {
        console.error(err);
    }
  }
  return (
      <div className="App">
        <div className="container">
          <h1>Web Scraper</h1>
          <ScrapeForm handleSubmit={handleSubmit} query={query} setQuery={setQuery} setUrls={setUrls} urls={urls} />

          <div className="results">
            {results.map((item, id)=>(
              <div key={id} className="card">

                <a href={item.url} target="_blank">
                  {item.name || item.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default App
