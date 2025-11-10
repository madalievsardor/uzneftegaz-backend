const xotinQizlarModel = require("../models/xotinQizlarModel");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const path = require("path");

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
    if (!title_uz || title_uz.trim() === "") missingFields.push("title_uz");
    if (!decree_uz || decree_uz.trim() === "") missingFields.push("decree_uz");
    if (!description_uz || description_uz.trim() === "")
      missingFields.push("description_uz");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Quyidagi ${missingFields} to'ldirilmagan`,
      });
    }

    const newDocument = new xotinQizlarModel({
      title: {
        uz: title_uz,
        oz: title_oz,
        ru: title_ru,
      },
      decree: {
        uz: decree_uz,
        oz: decree_oz,
        ru: decree_ru,
      },
      description: {
        uz: description_uz,
        oz: description_oz,
        ru: description_ru,
      },
      file: req.file.filename,
      fileType: req.file.mimetype,
    });

    await newDocument.save();

    res
      .status(201)
      .json({ message: "Ma'lumot muvaffaqiyatli yaratildi!", newDocument });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const documents = await xotinQizlarModel.find();
    res.status(200).json({ message: "Barcha hujjatlar", documents });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.update = async (req, res) => {
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

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const document = await xotinQizlarModel.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    // 🔹 Agar yangi fayl yuklangan bo‘lsa
    if (req.file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/zip",
        "application/x-zip-compressed",
      ];

      // Fayl turini tekshirish
      if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path); // noto‘g‘ri faylni o‘chirish
        return res.status(400).json({
          message:
            "Faqat PDF, DOC, DOCX, XLSX yoki ZIP formatdagi fayllarni yuklash mumkin!",
        });
      }

      // Eski faylni o‘chirish (agar mavjud bo‘lsa)
      const oldFilePath = path.join(
        __dirname,
        "../uploads/xotinQizlar",
        document.file
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Yangi fayl ma'lumotlarini yozish
      document.file = req.file.filename;
      document.fileType = req.file.mimetype;
    }

    // 🔹 Matnli maydonlarni yangilash
    document.title = {
      uz: title_uz || document.title.uz,
      oz: title_oz || document.title.oz,
      ru: title_ru || document.title.ru,
    };

    document.decree = {
      uz: decree_uz || document.decree.uz,
      oz: decree_oz || document.decree.oz,
      ru: decree_ru || document.decree.ru,
    };

    document.description = {
      uz: description_uz || document.description.uz,
      oz: description_oz || document.description.oz,
      ru: description_ru || document.description.ru,
    };

    await document.save();

    res
      .status(200)
      .json({ message: "Hujjat muvaffaqiyatli yangilandi.", document });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};


exports.remove = async (req, res) => {
  try{
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: "Noto'g'ri ID format"})
    }
    const document = await xotinQizlarModel.findByIdAndDelete(id)
    if(!document) {
      return res.status(404).json({message: "Ma'lumot topilmadi!"})
    }
    res.status(200).json({message: "Hujjat muvaffaqiyatli o'chirildi!"})
  }catch(e) {
    res.status(500).json({message: "Serverda xatolik", error: e.message})
  }
}