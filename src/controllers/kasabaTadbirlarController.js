const mongoose = require("mongoose");
const kasabaTadbirlarModel = require("../models/kasabaTadbirlarModel");
const cloudinary = require("../config/cloudinary");

exports.create = async (req, res) => {
    try {
        const {
            title_uz,
            title_ru,
            title_oz,
            description_uz,
            description_ru,
            description_oz,
            date,
            time,
            location_uz,
            location_ru,
            location_oz,
            category_uz,
            category_ru,
            category_oz,
            users,
        } = req.body;

        const missingFields = []

        if (!title_uz.trim()) missingFields.push("title_uz")
        if (!description_uz.trim()) missingFields.push("description_uz");
        if (!category_uz.trim()) missingFields.push("category_uz")
        if (!users.trim()) missingFields.push("users")
        if (!location_uz.trim()) missingFields.push("location_uz")
        if (!time.trim()) missingFields.push("time")
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Quyidagi ${missingFields} to'ldirilmagan!` })
        }
        const allowed_uz = ["Форум", "Конференсия", "Ко'ргазма", "Спорт", "Фестивал"]
        const allowed_ru = ["Фрум", "Конференция", "Выставка", "Спорт", "Фестиваль"]
        const allowed_oz = ["Forum", "Konferensiya", "Ko'rgazma", "Sport", "Festival"]

        if (!allowed_uz.includes(category_uz)) return res.status(400).json({ message: "category_uz 'Форум' yoki 'Конференсия' yoki 'Ко'ргазма' yoki 'Спорт' yoki 'Фестивал' kiritish mumkun!" })
        if (category_ru && !allowed_ru.includes(category_ru)) return res.status(400).json({ message: " category_ru 'Фрум' yoki 'Конференция' yoki 'Выставка' yoki 'Спорт' yoki 'Фестиваль' kiritish mumkun!" })
        if (category_oz && !allowed_oz.includes(category_oz)) return res.status(400).json({ message: " category_oz 'Forum' yoki 'Konferensiya' yoki 'Ko'rgazma' yoki 'Sport' yoki 'Festival' kiritish mumkun!" })
        let mediaType = [];
        if (req.files && req.files.length > 0) {
            mediaType = req.files.map(file => ({
                url: file.path,
                public_id: file.filename,
                type: file.mimetype.startWith("video/") ? "video" : "image"
            }));
        }

        const tadbir = new kasabaTadbirlarModel({
            title: { uz: title_uz, ru: title_ru, oz: title_oz },
            description: { uz: description_uz, ru: description_ru, oz: description_oz },
            date,
            time,
            location: { uz: location_uz, ru: location_ru, oz: location_oz },
            category: { uz: category_uz, ru: category_ru, oz: category_ru },
            users,
            mediaType
        });

        await tadbir.save();
        res.status(201).json({ message: "Ma'lumot muvaffaqiyatli yaratildi!", tadbir })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}

exports.getAll = async (req, res) => {
    try {
        const tadbir = await kasabaTadbirlarModel.find().sort({ createdAt: -1 })
        res.status(200).json({ message: "Barcha ma'lumotlar", tadbir })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto'g'ri ID format!" })
        }

        const tadbir = await kasabaTadbirlarModel.findById(id)
        if (!tadbir) {
            return res.status(404).json({ message: "Ma'lumot topilmadi!" })
        }
        const {
            title_uz,
            title_ru,
            title_oz,
            description_uz,
            description_ru,
            description_oz,
            date,
            time,
            location_uz,
            location_ru,
            location_oz,
            category_uz,
            category_ru,
            category_oz,
            users,
        } = req.body;

        if (req.files && req.files.length > 0 && tadbir.mediaType.length > 0) {
            for (const media of tadbir.mediaType) {
                try {
                    await cloudinary.uploader.destroy(media.public_id, { resource_type: media.type === "video" ? "video" : "image" });
                } catch (err) {
                    console.warn(`Eski faylni o'chirishda xatolik: ${media.public_id}`);
                }
            }
            tadbir.mediaType = req.files.map(file => ({
                url: file.path,
                public_id: file.filename,
                type: file.mimetype.startsWith("video/") ? "video" : "image"
            }));
        }

        // Yangilash
        tadbir.title.uz = title_uz || tadbir.title.uz;
        tadbir.title.ru = title_ru || tadbir.title.ru;
        tadbir.title.oz = title_oz || tadbir.title.oz;

        tadbir.description.uz = description_uz || tadbir.description.uz;
        tadbir.description.ru = description_ru || tadbir.description.ru;
        tadbir.description.oz = description_oz || tadbir.description.oz;

        tadbir.date = date || tadbir.date;
        tadbir.time = time || tadbir.time;

        tadbir.location.uz = location_uz || tadbir.location.uz;
        tadbir.location.ru = location_ru || tadbir.location.ru;
        tadbir.location.oz = location_oz || tadbir.location.oz;

        tadbir.category.uz = category_uz || tadbir.category.uz;
        tadbir.category.ru = category_ru || tadbir.category.ru;
        tadbir.category.oz = category_oz || tadbir.category.oz;

        tadbir.users = users || tadbir.users;

        await tadbir.save();

        res.status(200).json({ message: "Tadbir muvaffaqiyatli yangilandi", tadbir })
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto'g'ri ID format!" })
        }

        const tadbir = await kasabaTadbirlarModel.findById(id)
        if (!tadbir) {
            return res.status(404).json({ message: "Ma'lumot topilmadi!" })
        }

        if (tadbir.mediaType && tadbir.mediaType.length > 0) {
            for (const media of tadbir.mediaType) {
                try {
                    await cloudinary.uploader.destroy(media.public_id, { resource_type: media.type === "video" ? "video" : "image" });
                } catch (err) {
                    console.warn(`Cloudinary o‘chirish xatosi: ${media.public_id}`);
                }
            }
        }

        await kasabaTadbirlarModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Tadbir muvaffaqiyatli o'chirildi" });
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik", error: e.message })
    }
}
