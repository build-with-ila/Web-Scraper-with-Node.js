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
            <h2>🔎 Search Query</h2>
            <input
                type="text"
                placeholder="e.g. AI startups in Singapore"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <h2>🌐 Or Seed URLs (one per line)</h2>
            <textarea
                rows={5}
                placeholder={`https://example.com\nhttps://another.io`}
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
            />

            <button type="submit">Scrape</button>
        </form>
    )
}

export default ScrapeForm