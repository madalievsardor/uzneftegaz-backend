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

        if (!title_uz.trim()) missingFields.push("title_uz");
        if (!title_ru.trim()) missingFields.push("title_ru");
        if (!title_oz.trim()) missingFields.push("title_oz");
        if (!description_uz.trim()) missingFields.push("description_uz");
        if (!description_ru.trim()) missingFields.push("description_ru");
        if (!description_oz.trim()) missingFields.push("description_oz");
        if (!avtor_uz.trim()) missingFields.push("avtor_uz");
        if (!avtor_ru.trim()) missingFields.push("avtor_ru");
        if (!avtor_oz.trim()) missingFields.push("avtor_oz");
        if (!pages.trim()) missingFields.push("pages");
        if (!year.trim()) missingFields.push("year");
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Quyidagi ${missingFields} to'ldirilmagan!` })
        }

        let mediaType = [];

        // 📌 Rasm/video fayllar
        const filesImage = req.filesImage || [];
        filesImage.forEach(file => {
            mediaType.push({
                url: file.path,
                public_id: file.filename,
                type: file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/") ? "image" : "book"
            });
        });

        // 📌 Hujjatlar (PDF, DOC, XLSX va h.k.)
        const filesDoc = req.filesDocument || [];
        filesDoc.forEach(file => {
            mediaType.push({
                url: file.path,
                public_id: file.filename,
                type: "book"
            });
        });

        const book = new booksSchema({
            title: { uz: title_uz, ru: title_ru, oz: title_oz },
            avtor: { uz: avtor_uz, ru: avtor_ru, oz: avtor_oz },
            description: { uz: description_uz, ru: description_ru, oz: description_oz },
            pages,
            year,
            mediaType
        });
        await book.save();
        res.status(201).json({ message: "Kitob muvaffaqiyatli yaratildi", book });
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik: ", error: e.message })
    }
}

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
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Noto'g'ri ID format!" });

        const book = await booksSchema.findById(id);
        if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

        const {
            title_uz, title_ru, title_oz,
            description_uz, description_ru, description_oz,
            avtor_uz, avtor_ru, avtor_oz,
            pages, year
        } = req.body;

        // Agar yangi media kelgan bo'lsa
        const filesImage = req.filesImage || [];
        const filesDoc = req.filesDocument || [];
        if (filesImage.length > 0 || filesDoc.length > 0) {
            // eski media o'chirish
            if (book.mediaType.length > 0) {
                for (const media of book.mediaType) {
                    try {
                        await cloudinary.uploader.destroy(media.public_id, { resource_type: media.type === "book" ? "raw" : "image" });
                    } catch (err) {
                        console.warn("Eski faylni o'chirishda xatolik:", media.public_id);
                    }
                }
            }

            let mediaType = [];
            filesImage.forEach(file => mediaType.push({
                url: file.path,
                public_id: file.filename,
                type: file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/") ? "image" : "book"
            }));
            filesDoc.forEach(file => mediaType.push({
                url: file.path,
                public_id: file.filename,
                type: "book"
            }));

            book.mediaType = mediaType;
        }

        // yangilash
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
        res.status(200).json({ message: "Kitob muvaffaqiyatli yangilandi", book });
    } catch (e) {
        res.status(500).json({ message: "Serverda xatolik: ", error: e.message })
    }
}

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