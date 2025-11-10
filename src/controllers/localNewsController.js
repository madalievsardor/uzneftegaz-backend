const LocalNews = require("../models/localNewsModel");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!title_uz || !desc_uz) {
      return res.status(400).json({ message: "O'zbekcha title va description majburiy!" });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "localNews",
          use_filename: true,
          unique_filename: true,
        });
        images.push({ url: result.secure_url, public_id: result.public_id });
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    }

    const news = new LocalNews({
      title: { uz: title_uz, ru: title_ru, oz: title_oz },
      description: { uz: desc_uz, ru: desc_ru, oz: desc_oz },
      images,
    });

    await news.save();
    res.status(201).json({ message: "Yangilik muvaffaqiyatli yaratildi", news });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const news = await LocalNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    let updatedImages = [...(news.images || [])];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "localNews",
          use_filename: true,
          unique_filename: true,
        });
        updatedImages.push({ url: result.secure_url, public_id: result.public_id });

        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
    }

    news.title.uz = title_uz || news.title.uz;
    news.title.ru = title_ru || news.title.ru;
    news.title.oz = title_oz || news.title.oz;

    news.description.uz = desc_uz || news.description.uz;
    news.description.ru = desc_ru || news.description.ru;
    news.description.oz = desc_oz || news.description.oz;

    news.images = updatedImages;

    await news.save();
    res.status(200).json({ message: "Yangilik muvaffaqiyatli yangilandi ", news });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const news = await LocalNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    if (news.images && news.images.length > 0) {
      for (const img of news.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn("Cloudinary rasmni o'chirishda xatolik:", err.message);
          }
        }
      }
    }

    await LocalNews.findByIdAndDelete(id);
    res.status(200).json({ message: "Yangilik muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error("Xatolik (remove):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const news = await LocalNews.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha local yangiliklar", news });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const news = await LocalNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    res.status(200).json({ message: "Yangilik topildi", news });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};