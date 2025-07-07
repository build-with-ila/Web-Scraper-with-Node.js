import axios from "axios";

export const scrapeCompanies = async(payload: {query?: string; urls?:string[]}) => {
    //console.log("api: "+query);
    const response = await axios.post("http://localhost:5000/api/scrape", payload);
    return response.data;
}