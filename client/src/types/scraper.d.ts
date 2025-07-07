export interface ScrapedCompany {
  url: string;
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  error?: string;
}

export interface ScrapeFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  //results: ScrapedCompany[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  urls: string;
  setUrls: React.Dispatch<React.SetStateAction<string>>;
}