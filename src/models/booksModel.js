const mongoose = require("mongoose");

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

        // 📸 Rasmlar — ARRAY EMAS
        mediaType: {
            url: { type: String},
            public_id: { type: String},
            type: { type: String },
        },

        // 📄 Hujjatlar — ARRAY EMAS
        mediaDocs: {
            url: { type: String},
            public_id: { type: String},
            format: { type: String },
        },
    }
);

module.exports = mongoose.model("NefteGazBooks", booksSchema);
