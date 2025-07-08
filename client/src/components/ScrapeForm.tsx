import type { ScrapeFormProps } from '../types/scraper';

const ScrapeForm: React.FC<ScrapeFormProps> = ({
        handleSubmit,
        query,
        setQuery,
        urls,
        setUrls
    }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h3>🔎 Search Query</h3>
                <input
                    type="text"
                    placeholder="e.g. AI startups in Singapore"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <h3>🌐 Or Seed URLs (one per line)</h3>
                <textarea
                    rows={5}
                    placeholder={`https://example.com\nhttps://another.io`}
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                />
            </div>
            <button type="submit">Scrape</button>
            
        </form>
    )
}

export default ScrapeForm
