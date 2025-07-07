import express from "express"
import cors from "cors"
import scraperRoutes from "./routes/scraper"

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", scraperRoutes);

//app.get("/", (_,res)=>res.send("API is running"));

app.listen(5000, ()=>console.log("Server listening on port 5000"));