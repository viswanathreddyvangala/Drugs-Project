// backend/scripts/importData.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Drug = require('../models/Drug');
require('dotenv').config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/druginfo';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('connected to mongo');

  const filePath = path.join(__dirname, '..', 'data', 'drugData2025.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const docs = JSON.parse(raw);

  // Optionally clear collection before import
  await Drug.deleteMany({});
  console.log('cleared drugs collection');

  // normalize: ensure launchDate parsed to Date
  const prepared = docs.map(d => ({
    code: d.code,
    genericName: d.genericName,
    brandName: d.brandName,
    company: d.company,
    launchDate: d.launchDate ? new Date(d.launchDate) : null
  }));

  await Drug.insertMany(prepared);
  console.log(`inserted ${prepared.length} documents`);

  mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
