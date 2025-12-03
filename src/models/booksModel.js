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

        // 📸 Rasmlar TG FRONT KABI mediaType ichida qoladi
        mediaType: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
                type: { type: String }, // eski kodni buzmaslik uchun qoldirdim, required emas
            },
        ],

        // 📄 Hujjatlar uchun yangi field
        mediaDocs: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
                format: { type: String }, // doc/pdf/xls va hokazo
            },
        ],
    }
);

module.exports = mongoose.model("NefteGazBooks", booksSchema);
