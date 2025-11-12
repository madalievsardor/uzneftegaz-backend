const IndustryNews = require("../models/industryNewsModel");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const fs = require("fs")
exports.create = async (req, res) => {
  try {
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!title_uz || !desc_uz) {
      return res.status(400).json({ message: "O'zbekcha title va description majburiy!" });
    }

    let mediaType = [];
    if(req.files && req.files.length > 0) {
      for(const file of req.files) {
        mediaType.push({
          url: file.path,
          public_id: file.filename,
          type: file.mimetype.startsWith("video/") ? "video" : "image",
        })
      }
    } else{
      return res.status(400).json({message: "Rasm yoki video yuklash majburiy"})
    }

    const news = new IndustryNews({
      title: { uz: title_uz, ru: title_ru, oz: title_oz },
      description: { uz: desc_uz, ru: desc_ru, oz: desc_oz },
      mediaType, 
    });

    await news.save();

    res.status(201).json({ message: "Yangilik muvaffaqiyatli yuklandi", news });
  } catch (error) {
    console.error("Xatolik :", error);
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

    const news = await IndustryNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    if(req.files && req.files.length > 0 && news.mediaType.length > 0) {
      for(const media of news.mediaType) {
        try{
          await cloudinary.uploader.destroy(media.public_id, {
            resource_type: media.type === "video" ? "video" : "image",
          })
        } catch(err) {
          console.warn(`Eski faylni o'chirishda xatolik: ${media.public_id}`)
        }
      }
    }    

    let newMedia = news.mediaType;
    if(req.files && req.files.length > 0) {
      newMedia = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        type: file.mimetype.startsWith("video/") ? "video" : "image"
      }))
    }

    news.title.uz = title_uz || news.title.uz;
    news.title.ru = title_ru || news.title.ru;
    news.title.oz = title_oz || news.title.oz;

    news.description.uz = desc_uz || news.description.uz;
    news.description.ru = desc_ru || news.description.ru;
    news.description.oz = desc_oz || news.description.oz;

    news.mediaType = newMedia;

    await news.save();

    res.status(200).json({ message: "Yangilik muvaffaqiyatli yangilandi", news });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// 🟢 Industry News o‘chirish
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const news = await IndustryNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    // 🔹 Cloudinary fayllarni o‘chirish
    if (news.images && news.images.length > 0) {
      for (const img of news.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.warn("Rasmni o'chirishda xatolik:", err.message);
          }
        }
      }
    }

    await IndustryNews.findByIdAndDelete(id);

    res.status(200).json({ message: "Yangilik muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error(" Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const news = await IndustryNews.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha yangiliklar", news });
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

    const news = await IndustryNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    res.status(200).json({ message: "Yangilik topildi", news });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

