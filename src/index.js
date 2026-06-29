// src/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import catalogRoutes from "./routes/catalog.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "tawk-ai-tool-api",
  });
});

app.use("/api/catalog", catalogRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});