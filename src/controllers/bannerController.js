const bannerModel = require("../models/bannerModel");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose")
const cloudinary = require("../config/cloudinary");
// 🟢 Banner yaratish
exports.create = async (req, res) => {
  console.log("reqFile", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Fayl yuklanmadi" });
    }

    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!title_uz?.trim()) {
      return res.status(400).json({ message: "Sarlavha (Uz) majburiy maydon" });
    }

    const maxLength = 300;
    if (
      title_uz.length > maxLength ||
      (title_ru && title_ru.length > maxLength) ||
      (title_oz && title_oz.length > maxLength)
    ) {
      return res.status(400).json({
        message: `Sarlavha uzunligi ${maxLength} belgidan oshmasligi kerak`,
      });
    }

    const mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";

    const newBanner = new bannerModel({
      file: req.file.path,
      public_id: req.file.filename || req.file.public_id, // TO‘G‘RI!
      title: {
        uz: title_uz,
        ru: title_ru || "",
        oz: title_oz || "",
      },
      description: {
        uz: desc_uz || "",
        ru: desc_ru || "",
        oz: desc_oz || "",
      },
      mediaType,
    });

    const savedBanner = await newBanner.save();

    console.log("BANNER SAQLANDI:", savedBanner._id);

    res.status(201).json({
      message: "Ma'lumot muvaffaqiyatli joylandi!",
      banner: savedBanner,
    });
  } catch (e) {
    console.error("Banner yaratishda xato:", e);
    res.status(500).json({ 
      message: "Server xatosi", 
      error: e.message 
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const banners = await bannerModel.find().sort({ createdAt: -1 });
    res.status(200).json({message: "All users", banners});
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner topilmadi" });
    }

    res.status(200).json({ message: "Banner topildi", data: banner });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID format!" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }
    // --- Fayl yangilanishi ---
    if (req.file) {
      // Agar eski fayl bo‘lsa, Cloudinary’dan o‘chirish
      if (banner.public_id) {
        await cloudinary.uploader.destroy(banner.public_id);
      }

      // Yangi faylni Cloudinary’ga yuklash
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        resource_type: req.file.mimetype.startsWith("video/") ? "video" : "image",
        folder: "banners",
      });

      banner.file = uploaded.secure_url;       // URL
      banner.public_id = uploaded.public_id;  // Cloudinary public_id
      banner.mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    const { title_uz, title_ru, title_oz, description_uz, description_ru, description_oz } = req.body;

    // --- title yangilash ---
    if (title_uz || title_ru || title_oz) {
      if (!title_uz || title_uz.trim() === "") {
        return res.status(400).json({ message: "title_uz majburiy!" });
      }
      banner.title = {
        uz: title_uz || banner.title.uz,
        ru: title_ru || banner.title.ru,
        oz: title_oz || banner.title.oz,
      };
    }

    // --- description yangilash ---
    if (description_uz || description_ru || description_oz) {
      if (!description_uz || description_uz.trim() === "") {
        return res.status(400).json({ message: "description_uz majburiy!" });
      }
      banner.description = {
        uz: description_uz || banner.description.uz,
        ru: description_ru || banner.description.ru,
        oz: description_oz || banner.description.oz,
      };
    }

    await banner.save();

    res.status(200).json({
      message: "Banner muvaffaqiyatli yangilandi",
      data: banner,
    });
  } catch (error) {
    console.error("❌ Yangilash xatosi:", error.message);
    res.status(500).json({
      message: "❌ Yangilashda xatolik yuz berdi",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) return res.status(404).json({ message: "Banner topilmadi" });

    if (banner.public_id) {
      await cloudinary.uploader.destroy(banner.public_id);
    }

    await bannerModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Banner muvaffaqiyatli o'chirildi" });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};