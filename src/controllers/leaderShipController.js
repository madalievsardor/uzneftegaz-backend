const leaderShipModel = require("../models/leaderModel");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary"); 
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const {
      fullName_uz, fullName_ru, fullName_oz,
      grade_uz, grade_ru, grade_oz,
      phone, email,
      workDays_uz, workDays_ru, workDays_oz,
      workHours_start, workHours_end,
      description_uz, description_ru, description_oz,
    } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!fullName_uz || !grade_uz || !phone || !workDays_uz || !workHours_start || !workHours_end) {
      return res.status(400).json({ message: "Barcha majburiy maydonlar to'ldirilishi kerak!" });
    }

    let avatarUrl = "/assets/leader.png"; 
    let public_id = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "leaders", 
        use_filename: true,
        unique_filename: true,
      });

      avatarUrl = result.secure_url; 
      public_id = result.public_id;  // Fayl identifikatori

      // Yuklangan lokal faylni o'chirish
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const newLeader = new leaderShipModel({
      fullName: { uz: fullName_uz, ru: fullName_ru || "", oz: fullName_oz || "" },
      grade: { uz: grade_uz, ru: grade_ru || "", oz: grade_oz || "" },
      phone,
      email,
      avatar: avatarUrl,
      avatarPublicId: public_id, // public_id ni saqlash tavsiya qilinadi
      workDays: { uz: workDays_uz, ru: workDays_ru || "", oz: workDays_oz || "" },
      workHours: { start: workHours_start, end: workHours_end },
      description: { uz: description_uz || "", ru: description_ru || "", oz: description_oz || "" },
    });

    await newLeader.save();
    res.status(201).json({ message: "Rahbar muvaffaqiyatli qo'shildi", newLeader });

  } catch (err) {
    console.error("Xatolik:", err);
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Noto'g'ri ID format!" });

    const leader = await leaderShipModel.findById(id);
    if (!leader) return res.status(404).json({ message: "Rahbar topilmadi!" });

    const {
      fullName_uz, fullName_oz, fullName_ru,
      grade_uz, grade_oz, grade_ru,
      phone, email,
      workDays_uz, workDays_oz, workDays_ru,
      workHours_start, workHours_end,
      description_uz, description_oz, description_ru,
    } = req.body;

    if (req.file) {
      if (leader.avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(leader.avatarPublicId);
        } catch (err) {
          console.warn("Cloudinary eski rasmni o'chirishda xatolik:", err.message);
        }
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "leaders",
        use_filename: true,
        unique_filename: true,
      });

      leader.avatar = result.secure_url;
      leader.avatarPublicId = result.public_id;

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    leader.fullName = { uz: fullName_uz || leader.fullName.uz, ru: fullName_ru || leader.fullName.ru, oz: fullName_oz || leader.fullName.oz };
    leader.grade = { uz: grade_uz || leader.grade.uz, ru: grade_ru || leader.grade.ru, oz: grade_oz || leader.grade.oz };
    if (phone) leader.phone = phone;
    if (email) leader.email = email;
    leader.workDays = { uz: workDays_uz || leader.workDays.uz, ru: workDays_ru || leader.workDays.ru, oz: workDays_oz || leader.workDays.oz };
    leader.workHours = { start: workHours_start || leader.workHours.start, end: workHours_end || leader.workHours.end };
    leader.description = { uz: description_uz || leader.description.uz, ru: description_ru || leader.description.ru, oz: description_oz || leader.description.oz };

    await leader.save();
    res.status(200).json({ message: "Rahbar muvaffaqiyatli yangilandi", leader });

  } catch (err) {
    console.error(" Yangilashda xatolik:", err);
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Noto'g'ri ID format" });

    const leader = await leaderShipModel.findById(id);
    if (!leader) return res.status(404).json({ message: "Rahbar topilmadi" });

    // Eski rasmni Cloudinary’dan o‘chirish
    if (leader.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(leader.avatarPublicId);
      } catch (err) {
        console.warn("Cloudinary rasmni o'chirishda xatolik:", err.message);
      }
    }

    await leaderShipModel.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Rahbar muvaffaqiyatli o'chirildi" });

  } catch (err) {
    console.error("O'chirish xatosi:", err);
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};
exports.getAllLeader = async (req, res) => {
  try {
    const leaders = await leaderShipModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha rahbarlar", leaders });
  } catch (e) {
    console.error("Ma'lumot olishda xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const leader = await leaderShipModel.findById(id);
    if (!leader)
      return res.status(404).json({ message: "Rahbar topilmadi" });

    res.status(200).json({ message: "Rahbar topildi", leader });
  } catch (e) {
    console.error("Xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

