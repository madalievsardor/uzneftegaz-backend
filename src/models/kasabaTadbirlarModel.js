const mongoose = require("mongoose");

const kasabaTadbirlarSchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true },
        ru: { type: String, required: true },
        oz: { type: String, required: true },
    },
    description: {
        uz: { type: String, required: true },
        ru: { type: String, required: true },
        oz: { type: String, required: true },
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
        uz: { type: String, required: true },
        ru: { type: String },
        oz: { type: String }
    },
    category: {
        uz: { 
            type: String, 
            required: true, 
            enum: ["Форум", "Конференсия", "Ко'ргазма", "Спорт", "Фестивал"] 
        },
        ru: { 
            type: String, 
            enum: ["Фрум", "Конференция", "Выставка", "Спорт", "Фестиваль"] 
        },
        oz: { 
            type: String, 
            enum: ["Forum", "Konferensiya", "Ko'rgazma", "Sport", "Festival"] 
        }
    },
    users: { type: Number, required: true },
    mediaType: [
        {
            url: { type: String, required: true},
            public_id: { type: String, required: true},
            type: { type: String, enum: ["image", "video"], required: true}            
        }
    ]
}, { timestamps: true}
)

module.exports = mongoose.model("NeefteGazTadbirlar", kasabaTadbirlarSchema);