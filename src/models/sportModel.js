const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
  {
    title: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    description: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    place: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    athlete: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    category: {
      uz: { type: String, required: true, enum: ["Спорт", "Маданият"] },
      ru: { type: String, required: false, enum: ["Спорт", "Культура"] },
      oz: { type: String, required: false, enum: ["Sport", "Madaniyat"] },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("NefteGazSport", sportSchema);
