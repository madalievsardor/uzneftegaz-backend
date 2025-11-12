const NormativeDocument = require("../models/normativeDocumentModel");
const { default: mongoose } = require("mongoose");
const cloudinary = require("../config/cloudinary");

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

    const missingFields = [];
    if(!title_uz?.trim()) missingFields.push("title_uz");
    if(!decree_uz.trim()) missingFields.push("decree_uz");
    if(!description_uz.trim()) missingFields.push("description_uz")

      if(missingFields.length > 0) {
        return res.status(400).json({message: `Quyidagi ${missingFields} to'ldirilmagan`})
      }

    const fileData = {
      url: req.file.path, 
      public_id: req.file.filename,
      fileType: req.file.mimetype,
      originalName: req.file.originalname,
    };

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
      file: fileData.url,
      public_id: fileData.public_id,
      fileType: fileData.fileType,
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

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const document = await NormativeDocument.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
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
    res.status(500).json({
      message: "Serverda xatolik yuz berdi!",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID formati!" });
    }

    const document = await NormativeDocument.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }

    if (document.public_id) {
      try {
        await cloudinary.uploader.destroy(document.public_id, {
          resource_type: "raw",
        });
      } catch (err) {
        console.warn("Cloudinary faylni o'chirishda xatolik:", err.message);
      }
    }

    await NormativeDocument.findByIdAndDelete(id);

    res.status(200).json({
      message: "Hujjat muvaffaqiyatli o'chirildi!",
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