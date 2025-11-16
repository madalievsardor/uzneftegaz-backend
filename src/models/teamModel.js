const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    uz: { type: String, required: true },
    ru: { type: String, required: false },
    oz: { type: String, required: false },
  },
  grade: {
    uz: { type: String, required: true },
    ru: { type: String, required: false },
    oz: { type: String, required: false },
  },
  phone: { type: String, required: true },
  email: { type: String, required: false },
  avatar: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
});

module.exports = mongoose.model("NefteGazIshchi", teamSchema);
