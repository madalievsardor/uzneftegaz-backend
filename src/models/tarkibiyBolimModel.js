const mongoose = require("mongoose");

const tarkibiyBolimSchema = new mongoose.Schema(
  {
    title: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    employees: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    leader: {
      uz: { type: String, required: true },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
    description: {
      uz: { type: String, required: false },
      ru: { type: String, required: false },
      oz: { type: String, required: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NefteGazBolim", tarkibiyBolimSchema);
