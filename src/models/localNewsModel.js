const mongoose = require("mongoose");

const localNewsSchema = new mongoose.Schema(
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
    mediaType: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true }, 
      },
    ], // bir nechta rasm
  },
  { timestamps: true }
);

module.exports = mongoose.model("NefteGazNewsLocalNews", localNewsSchema);
