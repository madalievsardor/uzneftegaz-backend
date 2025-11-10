const mongoose = require("mongoose");

const plansReportsSchema = new mongoose.Schema(
  {
    startMonth: {
      uz: {
        type: String,
        required: true,
      },
      oz: {
        type: String,
      },
      ru: {
        type: String,
      },
    },
    endMonth: {
      uz: {
        type: String,
        required: true,
      },
      oz: {
        type: String,
      },
      ru: {
        type: String,
      },
    },
    category: {
      uz: {
        type: String,
        required: true,
        enum: ["Режа", "Хисобот"],
      },
      ru: {
        type: String,
      },
      oz: {
        type: String,
      },
    },
    title: {
      uz: { type: String, required: true },
      oz: { type: String, required: false },
      ru: { type: String, required: false },
    },
    description: {
      uz: { type: String, required: true },
      oz: { type: String, required: false },
      ru: { type: String, required: false },
    },
    participantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NefteGazPlansReports", plansReportsSchema);
