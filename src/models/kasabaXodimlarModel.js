const mongoose = require("mongoose");

const kasabaXodimlarSchema = new mongoose.Schema(
    {
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
            oz: { type: String, required: true }
        },
        description: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
            oz: { type: String, required: true }
        },
        gifts: [
            {
                uz: { type: String, required: true },
                ru: { type: String, required: true},
                oz: { type: String, required: true}
            }
        ],
        mediaType: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
                type: { type: String, enum: ["image", "video"], required: true }
            }
        ],
        category: {
            uz: { type: String, required: true },
            ru: { type: String, required: true },
            oz: { type: String, required: true }
        }
    }, {timestamps: true}
)

module.exports = mongoose.model("kasabaXodimlar", kasabaXodimlarSchema)