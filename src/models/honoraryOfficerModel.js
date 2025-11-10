const mongoose = require("mongoose");

const honoraryOfficerSchema = new mongoose.Schema(
  {
    fullName: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },

    specialist: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },

    experience: {
      uz: { type: String, required: false },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },

    project: {
      uz: { type: String, required: false },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },

    grade: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },

    description: {
      uz: { type: String },
      ru: { type: String },
      oz: { type: String },
    },

    image: { type: String, required: false },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("NefteGazHonorary", honoraryOfficerSchema);
