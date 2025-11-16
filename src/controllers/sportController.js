const mongoose = require("mongoose");
const sportSchema = require("../models/sportModel");

exports.create = async (req, res) => {
  try {
    const {
      title_uz,
      title_oz,
      title_ru,
      place_uz,
      place_oz,
      place_ru,
      description_uz,
      description_oz,
      description_ru,
      athlete_uz,
      athlete_oz,
      athlete_ru,
      category_uz,
      category_ru,
      category_oz,
    } = req.body;

    const missingFields = [];
    if (!title_uz?.trim()) missingFields.push("title_uz");
    if (!place_uz?.trim()) missingFields.push("place_uz");
    if (!description_uz?.trim()) missingFields.push("description_uz");
    if (!athlete_uz?.trim()) missingFields.push("athlete_uz");
    if (!category_uz?.trim()) missingFields.push("category_uz");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Quyidagi maydonlar to'ldirilmagan: ${missingFields.join(
          ", "
        )}`,
      });
    }

    const allowedUz = ["Спорт", "Маданият"];
    const allowedRu = ["Спорт", "Культура"];
    const allowedOz = ["Sport", "Madaniyat"];

    if (!allowedUz.includes(category_uz)) {
      return res.status(400).json({
        message: "category_uz faqat 'Спорт' yoki 'Маданият' bo'lishi kerak!",
      });
    }
    if (category_oz && !allowedOz.includes(category_oz)) {
      return res.status(400).json({
        message: "category_oz faqat 'Sport' yoki 'Madaniyat' bo'lishi kerak!",
      });
    }

    if (category_ru && !allowedRu.includes(category_ru)) {
      return res.status(400).json({
        message: "category_ru faqat 'Спорт' yoki 'Культура' bo'lishi kerak!",
      });
    }

    const sports = new sportSchema({
      title: { uz: title_uz, oz: title_oz, ru: title_ru },
      place: { uz: place_uz, oz: place_oz, ru: place_ru },
      description: {
        uz: description_uz,
        oz: description_oz,
        ru: description_ru,
      },
      athlete: { uz: athlete_uz, oz: athlete_oz, ru: athlete_ru },
      category: { uz: category_uz, oz: category_oz, ru: category_ru },
    });

    await sports.save();

    res.status(201).json({
      message: "Ma'lumot muvaffaqiyatli yaratildi!",
      sports,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda  xatolik", error: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const sports = await sportSchema.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Barcha ma'lumot",
      sports,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID noto'g'ri formatda!" });
    }

    const sports = await sportSchema.findById(id);
    if (!sports) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    const {
      title_uz,
      title_oz,
      title_ru,
      place_uz,
      place_oz,
      place_ru,
      description_uz,
      description_oz,
      description_ru,
      athlete_uz,
      athlete_oz,
      athlete_ru,
      category_uz,
      category_ru,
      category_oz,
    } = req.body;

    const allowedUz = ["Спорт", "Маданият"];
    const allowedRu = ["Спорт", "Культура"];
    const allowedOz = ["Sport", "Madaniyat"];

    if (!allowedUz.includes(category_uz)) {
      return res.status(400).json({
        message: "category_uz faqat 'Спорт' yoki 'Маданият' bo'lishi kerak!",
      });
    }
    if (category_oz && !allowedOz.includes(category_oz)) {
      return res.status(400).json({
        message: "category_oz faqat 'Sport' yoki 'Madaniyat' bo'lishi kerak!",
      });
    }

    if (category_ru && !allowedRu.includes(category_ru)) {
      return res.status(400).json({
        message: "category_ru faqat 'Спорт' yoki 'Культура' bo'lishi kerak!",
      });
    }
    // Faqat kelgan maydonlar yangilanadi
    sports.title.uz = title_uz ?? sports.title.uz;
    sports.title.oz = title_oz ?? sports.title.oz;
    sports.title.ru = title_ru ?? sports.title.ru;

    sports.place.uz = place_uz ?? sports.place.uz;
    sports.place.oz = place_oz ?? sports.place.oz;
    sports.place.ru = place_ru ?? sports.place.ru;

    sports.description.uz = description_uz ?? sports.description.uz;
    sports.description.oz = description_oz ?? sports.description.oz;
    sports.description.ru = description_ru ?? sports.description.ru;

    sports.athlete.uz = athlete_uz ?? sports.athlete.uz;
    sports.athlete.oz = athlete_oz ?? sports.athlete.oz;
    sports.athlete.ru = athlete_ru ?? sports.athlete.ru;

    sports.category.uz = category_uz ?? sports.category.uz;
    sports.category.ru = category_ru ?? sports.category.ru;
    sports.category.oz = category_oz ?? sports.category.oz;

    await sports.save();

    res.status(200).json({
      message: "Ma'lumot muvaffaqiyatli yangilandi!",
      sports,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID noto'g'ri formatda!" });
    }

    const deleted = await sportSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    res.status(200).json({
      message: "Ma'lumot muvaffaqiyatli o'chirildi!",
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};
