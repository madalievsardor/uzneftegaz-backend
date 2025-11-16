const mongoose = require("mongoose");
const teamModel = require("../models/teamModel");
const cloudinary = require("../config/cloudinary");

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name_uz, name_ru, name_oz, grade_uz, grade_ru, grade_oz, phone, email } = req.body;

    // Required fields tekshirish
    const missingFields = [];
    if (!name_uz?.trim()) missingFields.push("name_uz");
    if (!grade_uz?.trim()) missingFields.push("grade_uz");
    if (!phone?.trim()) missingFields.push("phone");

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Quyidagi mayondlar to'ldirilmagan: ${missingFields.join(", ")}` });
    }

    // Rasm borligini tekshirish
    if (!req.file) {
      return res.status(400).json({ message: "Rasm yuklash majburiy!" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Faqat rasm yuklash mumkin!" });
    }

    const team = new teamModel({
      name: { uz: name_uz, ru: name_ru, oz: name_oz },
      grade: { uz: grade_uz, ru: grade_ru, oz: grade_oz },
      phone,
      email,
      avatar: {
        url: req.file.path,          // Cloudinary secure_url
        public_id: req.file.filename // Cloudinary public_id
      },
    });

    await team.save();

    res.status(201).json({ message: "Ma'lumot muvaffaqiyatli yaratildi!", team });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const team = await teamModel.find();
    res.status(200).json({ message: "Barcha ma'lumotlar", team });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

// ================= REMOVE =================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const team = await teamModel.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    }

    // Cloudinary-dan rasmni o'chirish
    if (team.avatar?.public_id) {
      await cloudinary.uploader.destroy(team.avatar.public_id);
    }

    await teamModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Ma'lumot muvaffaqiyatli o'chirildi" });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const team = await teamModel.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Xodim topilmadi!" });
    }

    const { name_uz, name_ru, name_oz, grade_uz, grade_ru, grade_oz, phone, email } = req.body;

    // Ma'lumotlarni yangilash
    team.name.uz = name_uz ?? team.name.uz;
    team.name.ru = name_ru ?? team.name.ru;
    team.name.oz = name_oz ?? team.name.oz;

    team.grade.uz = grade_uz ?? team.grade.uz;
    team.grade.ru = grade_ru ?? team.grade.ru;
    team.grade.oz = grade_oz ?? team.grade.oz;

    team.phone = phone ?? team.phone;
    team.email = email ?? team.email;

    // Agar yangi rasm bo'lsa, Cloudinary-dan eski rasmni o'chirib yangisini qo'yish
    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Faqat rasm yuklash mumkin!" });
      }

      if (team.avatar?.public_id) {
        await cloudinary.uploader.destroy(team.avatar.public_id);
      }

      team.avatar = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    await team.save();

    res.status(200).json({ message: "Xodim ma'lumotlari muvaffaqiyatli yangilandi!", team });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};
