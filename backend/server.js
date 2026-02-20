import express from "express";
import cors from "cors";
import linkedinExtract from "./routes/linkedinExtract.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/linkedin", linkedinExtract);

app.get("/", (req, res) => res.send("LinkedIn PDF Extractor API running ✅"));

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));