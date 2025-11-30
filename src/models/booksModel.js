const mongoose = require("mongoose")

const booksSchema = new mongoose.Schema(
    {
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
            oz: { type: String, required: true },
        },
        avtor: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
            oz: { type: String, required: true },
        },
        description: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
            oz: { type: String, required: true },
        },
        pages: { type: Number, required: true },
        year: { type: Number, required: true },
        mediaType: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
                type: { type: String, enum: ["image", "book"], required: true }, // yangi qator
            },
        ],
    }
)

module.exports = mongoose.model("NefteGazBooks", booksSchema)