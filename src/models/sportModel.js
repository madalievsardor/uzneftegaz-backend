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
    },
      { timestamps: true }
)
module.exports = mongoose.model("NefteGazSport", sportSchema)