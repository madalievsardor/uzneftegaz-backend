const mongoose = require("mongoose");

const industryNewsModel = new mongoose.Schema(
  {
    title: {
      uz: { type: String, required: true },
      ru: { type: String },
      oz: { type: String },
    },
    description: {
      uz: { type: String, required: true },
      ru: { type: String },
      oz: { type: String },
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("NefteGazNewsIndustry", industryNewsModel);
