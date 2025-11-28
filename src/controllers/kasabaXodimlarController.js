const kasabaXodimlarModel = require("../models/kasabaXodimlarModel");
const mongoose = require("mongoose")
const cloudinary = require("../config/cloudinary")

exports.create = async (req, res) => {
    try {
        const {
            title_uz,
            title_ru,
            title_oz,
            description_uz,
            description_ru,
            description_oz,
            category_uz,
            category_ru,
            category_oz,
            gifts_uz,
            gifts_ru,
            gifts_oz,
        } = req.body;

        const missingFields = [];

        if (!title_uz.trim()) missingFields.push("title_uz");
        if (!title_ru.trim()) missingFields.push("title_ru");
        if (!title_oz.trim()) missingFields.push("title_oz");
        if (!description_uz.trim()) missingFields.push("description_uz");
        if (!description_ru.trim()) missingFields.push("description_ru");
        if (!description_oz.trim()) missingFields.push("description_oz");
        if (!category_uz.trim()) missingFields.push("category_uz");
        if (!category_ru.trim()) missingFields.push("category_ru");
        if (!category_oz.trim()) missingFields.push("category_oz");
        if (!gifts_uz || (Array.isArray(gifts_uz) && gifts_uz.length === 0) || (!Array.isArray(gifts_uz) && !gifts_uz.trim())) {
            missingFields.push("gifts_uz");
        }

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Quyidagi ${missingFields} to'ldirilmagan!` })
        }

        const gifts = [];

        if (Array.isArray(gifts_uz)) {
            for (let i = 0; i < gifts_uz.length; i++) {
                gifts.push({
                    uz: gifts_uz[i],
                    ru: gifts_ru[i],
                    oz: gifts_oz[i]
                });
            }
        } else {
            gifts.push({
                uz: gifts_uz,
                ru: gifts_ru,
                oz: gifts_oz
            });
        }
        let mediaType = [];

        if (req.files && req.files.length > 0) {
            mediaType = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
                type: file.mimetype.startsWith("video/") ? "video" : "image"
            }))
        }

        const xodim = new kasabaXodimlarModel({
            title: {
                uz: title_uz, ru: title_ru, oz: title_oz
            },
            description: {
                uz: description_uz,
                ru: description_ru,
                oz: description_oz,
            },
            category: {
                uz: category_uz,
                ru: category_ru,
                oz: category_oz
            },
            gifts,
            mediaType
        });

        await xodim.save();
        res.status(201).json({ message: "Ma'lumot muvaffaqiyatli qo'shildi!", xodim })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}

exports.getAll = async (req, res) => {
    try {
        const xodim = await kasabaXodimlarModel.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Barcha ma'lumotlar", xodim })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto'g'ri ID format" })
        }
        const xodim = await kasabaXodimlarModel.findById(id)
        if (!xodim) {
            return res.status(404).json({ message: "Ma'lumot topilmadi!" })
        }
        const {
            title_uz,
            title_ru,
            title_oz,
            description_uz,
            description_ru,
            description_oz,
            category_uz,
            category_ru,
            category_oz,
            gifts_uz,
            gifts_ru,
            gifts_oz,
        } = req.body;

        if (req.files && req.files.length > 0 && xodim.mediaType.length > 0) {
            for (const media of xodim.mediaType) {
                try {
                    await cloudinary.uploader.destroy(media.public_id, {
                        resource_type: media.type === "video" ? "video" : "image",
                    });
                } catch (err) {
                    console.warn(`Eski faylni o'chirishda xatolik: ${media.public_id}`)
                }
            }
            xodim.mediaType = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
                type: file.mimetype.startsWith("video/") ? "video" : "image"
            }))
        }

        xodim.title.uz = title_uz || xodim.title.uz;
        xodim.title.ru = title_ru || xodim.title.ru;
        xodim.title.oz = title_oz || xodim.title.oz;

        xodim.description.uz = description_uz || xodim.description.uz;
        xodim.description.ru = description_ru || xodim.description.ru;
        xodim.description.oz = description_oz || xodim.description.oz;

        xodim.category.uz = category_uz || xodim.category.uz;
        xodim.category.ru = category_ru || xodim.category.ru;
        xodim.category.oz = category_oz || xodim.category.oz;

        if (gifts_uz && gifts_ru && gifts_oz) {
            const gifts = [];
            if (Array.isArray(gifts_uz)) {
                for (let i = 0; i < gifts_uz.length; i++) {
                    gifts.push({
                        uz: gifts_uz[i],
                        ru: gifts_ru[i],
                        oz: gifts_oz[i],
                    });
                }
            } else {
                gifts.push({
                    uz: gifts_uz,
                    ru: gifts_ru,
                    oz: gifts_oz,
                });
            }
            xodim.gifts = gifts;
        }

        await xodim.save();
        res.status(200).json({ message: "Tadbir muvaffaqiyatli yangilandi", xodim })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}

exports.clearAllGifts = async (req, res) => {
  try {
    // Barcha xodimlarni yangilash
    const result = await kasabaXodimlarModel.updateMany(
      {},            // shart: hamma
      { $set: { gifts: [] } } // gifts array ni bo'shatish
    );

    res.status(200).json({
      message: "Barcha xodimlardagi gifts o'chirildi",
      modifiedCount: result.modifiedCount
    });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto'g'ri ID format!" })
        }

        const xodim = await kasabaXodimlarModel.findById(id);
        if (!xodim) {
            return res.status(404).json({ message: "Ma'lumot topilmadi!" })
        }

        if (xodim.mediaType && xodim.mediaType.length > 0) {
            for (const media of xodim.mediaType) {
                try {
                    await cloudinary.uploader.destroy(media.public_id, {
                        resource_type: media.type === "video" ? "video" : "image",
                    });
                } catch (err) {
                    console.warn(`Rasim o'chirishda xatolik: ${media.public_id}`);
                }
            }
        }

        await kasabaXodimlarModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Ma'lumot muvaffaqiyatli o'chirildi!" })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}