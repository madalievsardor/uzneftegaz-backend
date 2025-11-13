const yoshlarSiyosatiModel = require("../models/yoshlarSiyosatiModel");
const { default: mongoose } = require("mongoose");
const cloudinary = require("../config/cloudinary");

exports.create = async (req, res) => {
  try {
    const {
      title_uz,
      title_oz,
      title_ru,
      decree_uz,
      decree_oz,
      decree_ru,
      description_uz,
      description_oz,
      description_ru,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File yuklashingiz shart!" });
    }

    const missingFields = [];
    if (!title_uz?.trim()) missingFields.push("title_uz");
    if (!decree_uz?.trim()) missingFields.push("decree_uz");
    if (!description_uz?.trim()) missingFields.push("description_uz");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Quyidagi maydonlar to'ldirilmagan: ${missingFields.join(", ")}` });
    }

    // 🔹 Faylni Cloudinary'ga yuklash
    const fileData = {
      url: req.file.path,
      public_id:  req.file.filename,
      fileType: req.file.mimetype,
      originalName: req.file.originalname,
    };

    const newDocument = new yoshlarSiyosatiModel({
      title: { uz: title_uz, oz: title_oz, ru: title_ru },
      decree: { uz: decree_uz, oz: decree_oz, ru: decree_ru },
      description: { uz: description_uz, oz: description_oz, ru: description_ru },
      file: fileData.url,
      public_id: fileData.public_id,
      fileType: fileData.mimetype,
    });

    await newDocument.save();

    res.status(201).json({
      message: "Ma'lumot muvaffaqiyatli yaratildi!",
      data: newDocument,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_uz,
      title_oz,
      title_ru,
      decree_uz,
      decree_oz,
      decree_ru,
      description_uz,
      description_oz,
      description_ru,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati" });
    }

    const document = await yoshlarSiyosatiModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    if (req.file && document.public_id) {
      try {
        await cloudinary.uploader.destroy(document.public_id, {
          resource_type: "raw",
        });
      } catch (err) {
        console.warn("Eski faylni o'chirishda xatolik:", err.message);
      }
    }

    if (req.file) {
      document.file = req.file.path; 
      document.public_id = req.file.filename; 
      document.fileType = req.file.mimetype;
    }

    document.title.uz = title_uz || document.title.uz;
    document.title.ru = title_ru || document.title.ru;
    document.title.oz = title_oz || document.title.oz;

    document.decree.uz = decree_uz || document.decree.uz;
    document.decree.ru = decree_ru || document.decree.ru;
    document.decree.oz = decree_oz || document.decree.oz;

    document.description.uz = description_uz || document.description.uz;
    document.description.ru = description_ru || document.description.ru;
    document.description.oz = description_oz || document.description.oz;
    await document.save();

    res.status(200).json({
      message: "Hujjat muvaffaqiyatli yangilandi!",
      data: document,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};



exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ID formati to‘g‘rimi?
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati" });
    }

    const document = await yoshlarSiyosatiModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    // Cloudinary’dagi faylni o‘chirish
    if (document.public_id) {
      try {
        await cloudinary.uploader.destroy(document.public_id, {
          resource_type: "raw",
        });
      } catch (err) {
        console.warn("Cloudinary faylni o'chirishda xatolik:", err.message);
      }
    }

    // Ma'lumotni bazadan o‘chirish
    await yoshlarSiyosatiModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Hujjat muvaffaqiyatli o'chirildi!",
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const documents = await yoshlarSiyosatiModel.find().sort({ createdAt: -1});
    res.status(200).json({ message: "Barcha hujjatlar", documents });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};