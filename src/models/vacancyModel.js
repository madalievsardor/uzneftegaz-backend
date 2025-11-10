const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
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
  salary: {
    uz: { type: String },
    ru: { type: String },
    oz: { type: String },
  },
  requirements: { // ✅ to‘g‘rilandi
    uz: { type: String },
    ru: { type: String },
    oz: { type: String },
  },
  deadline: { type: Date, required: true },
  salaryType: {
    uz: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    },
    oz: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("NefteGazVacancy", vacancySchema);
