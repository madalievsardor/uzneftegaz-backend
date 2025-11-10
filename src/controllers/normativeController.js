const NormativeDocument = require("../models/normativeDocumentModel");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

exports.create = async (req, res) => {
  try {
    const {
      title_uz,
      title_ru,
      title_oz,
      decree_uz,
      decree_ru,
      decree_oz,
      description_uz,
      description_ru,
      description_oz,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Fayl yuklanmagan!" });
    }
    
    if (!title_uz || !decree_uz || !description_uz) {
      return res.status(400).json({
        message:
          "Majburiy maydonlar (title_uz, decree_uz, description_uz) to'ldirilishi kerak!",
        uploadedFile: req.file.filename,
      });
    }

    const newDocument = new NormativeDocument({
      title: {
        uz: title_uz,
        ru: title_ru,
        oz: title_oz,
      },
      decree: {
        uz: decree_uz,
        ru: decree_ru,
        oz: decree_oz,
      },
      description: {
        uz: description_uz,
        ru: description_ru,
        oz: description_oz,
      },
      file: req.file.filename,
      fileType: req.file.mimetype,
    });

    await newDocument.save();

    res.status(201).json({
      message: "Normativ hujjat muvaffaqiyatli yaratildi!",
      data: newDocument,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({
      message: "Serverda xatolik yuz berdi!",
      error: error.message,
    });
  }
};



exports.getAll = async (req, res) => {
  try {
    const documents = await NormativeDocument.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha hujjatlar", data: documents });
  } catch (error) {
    res.status(500).json({ message: "Ma'lumotlarni olishda xatolik", error });
  }
};

/**
 * 🔍 ID orqali olish
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" })
    }
    const document = await NormativeDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }
    res.status(200).json({ data: document });
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

exports.update = async (req, res) => {
  try {
    const document = await NormativeDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "❌ Hujjat topilmadi!" });
    }

    // body dan qiymatlarni olamiz
    const {
      title_uz,
      title_ru,
      title_oz,
      decree_uz,
      decree_ru,
      decree_oz,
      description_uz,
      description_ru,
      description_oz,
    } = req.body;

    if (req.file) {
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "application/x-coreldraw", 
        "image/x-coreldraw",
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        const uploadedPath = path.join(__dirname, "../uploads/files", req.file.filename);
        if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
        return res.status(400).json({
          message:
            "Faqat hujjat fayllarini (PDF, DOC, DOCX, XLS, XLSX, ZIP, CDR) yuklash mumkin!",
        });
      }

      // Eski faylni o‘chirish
      const oldFilePath = path.join(__dirname, "../uploads/files", document.file);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.warn("⚠️ Eski faylni o‘chirishda xatolik:", err.message);
        }
      }

      document.file = req.file.filename;
      document.fileType = req.file.mimetype;
    }

    // 🔹 Har bir tildagi matnlarni yangilash (agar yuborilgan bo‘lsa)
    if (title_uz || title_ru || title_oz) {
      document.title = {
        uz: title_uz || document.title.uz,
        ru: title_ru || document.title.ru,
        oz: title_oz || document.title.oz,
      };
    }

    if (decree_uz || decree_ru || decree_oz) {
      document.decree = {
        uz: decree_uz || document.decree.uz,
        ru: decree_ru || document.decree.ru,
        oz: decree_oz || document.decree.oz,
      };
    }

    if (description_uz || description_ru || description_oz) {
      document.description = {
        uz: description_uz || document.description.uz,
        ru: description_ru || document.description.ru,
        oz: description_oz || document.description.oz,
      };
    }

    await document.save();

    res.status(200).json({
      message: "✅ Hujjat muvaffaqiyatli yangilandi!",
      data: document,
    });
  } catch (error) {
    console.error("❌ Yangilash xatosi:", error);
    res.status(500).json({
      message: "❌ Hujjatni yangilashda xatolik yuz berdi!",
      error: error.message,
    });
  }
};

/**
 * 🗑 O‘chirish
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Noto'g'ri ID format"})
    }
    const document = await NormativeDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }

    // Faylni o‘chirish
    const filePath = path.join(__dirname, "../uploads/files", document.file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await NormativeDocument.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hujjat muvaffaqiyatli o‘chirildi ✅" });
  } catch (error) {
    res.status(500).json({ message: "O‘chirishda xatolik yuz berdi", error });
  }
};
