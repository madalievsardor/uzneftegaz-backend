const mongoose = require("mongoose");

const hisobotSchema = new mongoose.Schema(
  {
    startMonth: {
      uz: {
        type: String,
        required: true,
      },
      oz: {
        type: String,
      },
      ru: {
        type: String,
      },
    },
    endMonth: {
      uz: {
        type: String,
        required: true,
      },
      oz: {
        type: String,
      },
      ru: {
        type: String,
      },
    },
    plan: {
      uz: {
        type: String,
        required: true,
        enum: ["Режалаштирилган", "Бажарилмоқда", "Бажарилди", "Бажарилмади"],
      },
      oz: {
        type: String,
        required: false,
        enum: ["Rejalashtirilgan", "Bajarilmoqda", "Bajarildi", "Bajarilmadi"],
      },
      ru: {
        type: String,
        required: false,
        enum: ["Запланировано", "Выполняется", "Выполнено", "Не выполнено"],
      },
    },

    title: {
      uz: { type: String, required: true },
      oz: { type: String, required: false },
      ru: { type: String, required: false },
    },
    description: {
      uz: { type: String, required: true },
      oz: { type: String, required: false },
      ru: { type: String, required: false },
    },
    participantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NefteGazHisobot", hisobotSchema)
