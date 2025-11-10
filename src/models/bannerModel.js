const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        file: { type: String, required: true }, // Cloudinary URL
        public_id: { type: String }, // 🔹 Cloudinary ID — o‘chirish uchun kerak
        title: {
            uz: { type: String, required: true },
            ru: { type: String },
            oz: { type: String }, // 🔹 kr o‘rniga oz (o‘zbek lotincha)
        },
        description: {
            uz: { type: String },
            ru: { type: String },
            oz: { type: String },
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("NefteGazBanner", bannerSchema);
