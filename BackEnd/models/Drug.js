const mongoose = require("mongoose");

const DrugSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    genericName: { type: String },
    brandName: { type: String },
    company: { type: String, index: true },
    launchDate: { type: Date, index: true },
  },
  { collection: "drugs" }
);

module.exports = mongoose.model("Drug", DrugSchema);
