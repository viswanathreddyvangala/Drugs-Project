const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Drug = require("./models/Drug");

require("dotenv").config();

const PORT = process.env.PORT || 4000;
require('dotenv').config();

const user = process.env.DB_USER || 'viswanath';
const password = process.env.DB_PASS || 'Viswa@111';
const host = process.env.DB_HOST || 'cluster0.kmzouil.mongodb.net';
const dbName = process.env.DB_NAME || 'druginfo';

const encodedPassword = encodeURIComponent(password);
const MONGO = process.env.MONGO_URI ||
  `mongodb+srv://${user}:${encodedPassword}@${host}/${dbName}?retryWrites=true&w=majority`;

console.log('Using MONGO URI host:', host);
console.log('Using DB name:', dbName);
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Endpoint: config
app.get("/api/config", (req, res) => {
  const config = {
    columns: [
      { key: "id", label: "Id", type: "index" },
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "launchDate", label: "Launch Date", format: "localeDate" },
    ],
  };
  res.json(config);
});

// Endpoint: get distinct companies (for dropdown)
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Drug.distinct("company");
    // sort alphabetically
    companies.sort((a, b) => (a || "").localeCompare(b || ""));
    res.json(companies);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint: fetch drugs, supports company filter, pagination, sorted by launchDate desc
app.get("/api/drugs", async (req, res) => {
  try {
    const { company, limit = 100, skip = 0 } = req.query;
    const q = {};
    if (company) q.company = company;
    const total = await Drug.countDocuments(q);
    const rows = await Drug.find(q)
      .sort({ launchDate: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    res.json({ total, rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Server listening ${PORT}`));
