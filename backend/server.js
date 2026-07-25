require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errors");

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3001" }));
app.use(express.json({ limit: "100kb" }));
app.get("/health", (req, res) => res.json({ status: "ok", service: "maritime-dominion-api", timestamp: new Date().toISOString() }));
app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Maritime Dominion API listening on ${port}`));
