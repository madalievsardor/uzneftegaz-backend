const mongoose = require("mongoose");

const leaderShipSchema = new mongoose.Schema({
    fullName: {
        uz: { type: String, required: true },
        oz: { type: String, required: true },
        ru: { type: String, required: true }
    },
    grade: {
        uz: { type: String, required: true },
        oz: { type: String, required: true },
        ru: { type: String, required: true }
    },  
    phone: { type: String, required: true },
    email: { type: String, required: false },
    avatar: {
        type: String,
        default: "/assets/leader.png"
    },
    workDays: {
        uz: { type: String, required: true, example: "Душанба - Жума" },
        oz: { type: String, required: true, example: "Dushanba - Juma" },
        ru: { type: String, required: true, example: "Понедельник - Пятница" }
    },
    workHours: {
        start: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
            example: "09:00"
        },
        end: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
            example: "18:00"
        }
    },
    description: {
        uz: { type: String, required: false },
        oz: { type: String, required: false },
        ru: { type: String, required: false }
    }
}, { timestamps: true });

module.exports = mongoose.model("Leadership", leaderShipSchema);
