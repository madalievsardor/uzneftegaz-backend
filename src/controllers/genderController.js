const genderSchema = require("../models/genderModel");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

exports.create = async (req, res) => {
  try {
    const { title_uz, title_oz, title_ru, description_uz, description_oz, description_ru } = req.body;

    if (!title_uz) {
      return res.status(400).json({ message: "Title (UZ) majburiy!" });
    }

    let fileUrl = null;
    let public_id = null;

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "gender",
        resource_type: req.file.mimetype.startsWith("video/") ? "video" : "image",
      });

      fileUrl = uploaded.secure_url; // 🔹 Cloudinary URL
      public_id = uploaded.public_id;
    }

    const newGender = new genderSchema({
      title: { uz: title_uz, ru: title_ru, oz: title_oz },
      description: { uz: description_uz, ru: description_ru, oz: description_oz },
      file: fileUrl,      // 🔹 URL saqlanadi
      public_id,          // 🔹 Cloudinary public_id
    });

    await newGender.save();

    res.status(201).json({
      message: `${title_uz} muvaffaqiyatli yaratildi!`,
      newGender,
    });
  } catch (e) {
    console.error("Gender yaratishda xatolik:", e);
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const gender = await genderSchema.find();
    res.status(200).json({ message: "Barcha ma'lumotlar", gender });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }
    const deleteGender = await genderSchema.findByIdAndDelete(id);
    if (!deleteGender) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }
    res.status(200).json({ message: "Ma'lumot muvaffaqiyatli o'chirildi!" });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const gender = await genderSchema.findById(id);
    if (!gender) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    const {
      title_uz,
      title_oz,
      title_ru,
      description_uz,
      description_oz,
      description_ru,
    } = req.body;

    gender.title = {
      uz: title_uz || gender.title.uz,
      ru: title_ru || gender.title.ru,
      oz: title_oz || gender.title.oz,
    };

    gender.description = {
      uz: description_uz || gender.description.uz,
      ru: description_ru || gender.description.ru,
      oz: description_oz || gender.description.oz,
    };

    // Fayl kelgan bo'lsa
    if (req.file) {
      // Eski faylni Cloudinary'dan o'chirish
      if (gender.public_id) {
        await cloudinary.uploader.destroy(gender.public_id);
      }

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "gender",
        resource_type: req.file.mimetype.startsWith("video/") ? "video" : "image",
      });

      gender.file = uploaded.secure_url;
      gender.public_id = uploaded.public_id;
    }

    const updatedGender = await gender.save();

    res.status(200).json({
      message: "Ma'lumot muvaffaqiyatli yangilandi!",
      gender: updatedGender,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};