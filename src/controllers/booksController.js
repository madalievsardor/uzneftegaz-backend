const mongoose = require("mongoose");
const booksSchema = require("../models/booksModel");
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
            avtor_uz,
            avtor_ru,
            avtor_oz,
            pages,
            year
        } = req.body;

        const missingFields = [];

        if (!title_uz?.trim()) missingFields.push("title_uz");
        if (!title_ru?.trim()) missingFields.push("title_ru");
        if (!title_oz?.trim()) missingFields.push("title_oz");
        if (!description_uz?.trim()) missingFields.push("description_uz");
        if (!description_ru?.trim()) missingFields.push("description_ru");
        if (!description_oz?.trim()) missingFields.push("description_oz");
        if (!avtor_uz?.trim()) missingFields.push("avtor_uz");
        if (!avtor_ru?.trim()) missingFields.push("avtor_ru");
        if (!avtor_oz?.trim()) missingFields.push("avtor_oz");
        if (!pages) missingFields.push("pages");
        if (!year) missingFields.push("year");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Quyidagi maydonlar to'ldirilmagan: ${missingFields.join(", ")}`
            });
        }

        // 📌 Rasmlar (single object)
        let mediaType = null;
        if (req.files?.mediaType?.[0]) {
            const file = req.files.mediaType[0];
            mediaType = {
                url: file.path,
                public_id: file.filename,
                type: file.mimetype
            };
        }

        // 📄 Hujjatlar (single object)
        let mediaDocs = null;
        if (req.files?.mediaDocs?.[0]) {
            const file = req.files.mediaDocs[0];
            mediaDocs = {
                url: file.path,
                public_id: file.filename,
                format: file.mimetype
            };
        }

        const book = new booksSchema({
            title: { uz: title_uz, ru: title_ru, oz: title_oz },
            avtor: { uz: avtor_uz, ru: avtor_ru, oz: avtor_oz },
            description: { uz: description_uz, ru: description_ru, oz: description_oz },
            pages,
            year,
            mediaType, // SINGLE OBJECT
            mediaDocs  // SINGLE OBJECT
        });

        await book.save();

        res.status(201).json({ message: "Kitob muvaffaqiyatli yaratildi", book });

    } catch (e) {
        res.status(500).json({
            message: "Serverda xatolik",
            error: e.message
        });
    }
};



exports.getAll = async (req, res) => {
    try {
        const book = await booksSchema.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Barcha kitoblar", book });
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik: ", error: e.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto'g'ri ID format!" });
        }

        const book = await booksSchema.findById(id);
        if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

        const {
            title_uz, title_ru, title_oz,
            description_uz, description_ru, description_oz,
            avtor_uz, avtor_ru, avtor_oz,
            pages, year
        } = req.body;

        // =======================================================
        // 📁 Yangi yuklangan fayllar
        // SINGLE FILE → [0]
        // =======================================================
        const newImage = req.files?.mediaType?.[0] || null;
        const newDoc = req.files?.mediaDocs?.[0] || null;

        // ===========================
        // 📸 RASM YANGILASH
        // ===========================
        if (newImage) {
            // eski rasmni o'chirish
            if (book.mediaType && book.mediaType.public_id) {
                await cloudinary.uploader.destroy(book.mediaType.public_id, { resource_type: "image" });
            }
            // yangi rasmni saqlash
            book.mediaType = {
                url: newImage.path,
                public_id: newImage.filename,
                type: newImage.mimetype
            };
        }

        if (newDoc) {
            // eski docni o'chirish
            if (book.mediaDocs && book.mediaDocs.public_id) {
                await cloudinary.uploader.destroy(book.mediaDocs.public_id, { resource_type: "raw" });
            }
            // yangi docni saqlash
            book.mediaDocs = {
                url: newDoc.path,
                public_id: newDoc.filename,
                format: newDoc.mimetype
            };
        }


        // ===========================
        // 📌 MATN MAYDONLARNI YANGILASH
        // ===========================
        book.title.uz = title_uz || book.title.uz;
        book.title.ru = title_ru || book.title.ru;
        book.title.oz = title_oz || book.title.oz;

        book.avtor.uz = avtor_uz || book.avtor.uz;
        book.avtor.ru = avtor_ru || book.avtor.ru;
        book.avtor.oz = avtor_oz || book.avtor.oz;

        book.description.uz = description_uz || book.description.uz;
        book.description.ru = description_ru || book.description.ru;
        book.description.oz = description_oz || book.description.oz;

        book.pages = pages || book.pages;
        book.year = year || book.year;

        await book.save();

        res.status(200).json({
            message: "Kitob muvaffaqiyatli yangilandi",
            book
        });

    } catch (e) {
        res.status(500).json({
            message: "Serverda xatolik",
            error: e.message
        });
    }
};


exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Noto'g'ri ID format!" });

        const book = await booksSchema.findById(id);
        if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

        if (book.mediaType.length > 0) {
            for (const media of book.mediaType) {
                try {
                    await cloudinary.uploader.destroy(media.public_id, { resource_type: media.type === "book" ? "raw" : "image" });
                } catch (err) {
                    console.warn("Media o'chirishda xatolik:", media.public_id);
                }
            }
        }

        await booksSchema.findByIdAndDelete(id);
        res.status(200).json({ message: "Kitob muvaffaqiyatli o'chirildi" });
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik: ", error: e.message })
    }
}