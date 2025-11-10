const BolimModel = require("../models/tarkibiyBolimModel");
const mongoose = require("mongoose");

// ✅ Yangi bo‘lim yaratish
exports.create = async (req, res) => {
    try {
        const { title_uz, title_ru, title_oz, employees_uz, employees_ru, employees_oz, leader_uz, leader_ru, leader_oz, desc_uz, desc_ru, desc_oz } = req.body;

        if (!title_uz || !employees_uz || !leader_uz) {
            return res.status(400).json({ message: "Majburiy maydonlar to‘ldirilishi kerak!" });
        }

        const bolim = new BolimModel({
            title: { uz: title_uz, ru: title_ru, oz: title_oz },
            employees: { uz: employees_uz, ru: employees_ru, oz: employees_oz },
            leader: { uz: leader_uz, ru: leader_ru, oz: leader_oz },
            description: { uz: desc_uz, ru: desc_ru, oz: desc_oz },
        });

        await bolim.save();
        res.status(201).json({ message: "Bo‘lim muvaffaqiyatli yaratildi ✅", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ Barcha bo‘limlarni olish
exports.getAll = async (req, res) => {
    try {
        const bolimlar = await BolimModel.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Barcha bo‘limlar", bolimlar });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ ID orqali bitta bo‘limni olish
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto‘g‘ri ID!" });
        }

        const bolim = await BolimModel.findById(id);
        if (!bolim) return res.status(404).json({ message: "Bo‘lim topilmadi" });

        res.status(200).json({ message: "Bo‘lim topildi ✅", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ ID orqali bo‘limni yangilash
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto‘g‘ri ID!" });
        }

        const bolim = await BolimModel.findById(id);
        if (!bolim) return res.status(404).json({ message: "Bo‘lim topilmadi" });

        const { title_uz, title_ru, title_oz, employees_uz, employees_ru, employees_oz, leader_uz, leader_ru, leader_oz, desc_uz, desc_ru, desc_oz } = req.body;

        // Faqat kelgan maydonlarni yangilash
        bolim.title.uz = title_uz || bolim.title.uz;
        bolim.title.ru = title_ru || bolim.title.ru;
        bolim.title.oz = title_oz || bolim.title.oz;

        bolim.employees.uz = employees_uz || bolim.employees.uz;
        bolim.employees.ru = employees_ru || bolim.employees.ru;
        bolim.employees.oz = employees_oz || bolim.employees.oz;

        bolim.leader.uz = leader_uz || bolim.leader.uz;
        bolim.leader.ru = leader_ru || bolim.leader.ru;
        bolim.leader.oz = leader_oz || bolim.leader.oz;

        bolim.description.uz = desc_uz || bolim.description.uz;
        bolim.description.ru = desc_ru || bolim.description.ru;
        bolim.description.oz = desc_oz || bolim.description.oz;

        await bolim.save();
        res.status(200).json({ message: "Bo‘lim muvaffaqiyatli yangilandi ✅", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ ID orqali bo‘limni o‘chirish
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto‘g‘ri ID!" });
        }

        const bolim = await BolimModel.findById(id);
        if (!bolim) return res.status(404).json({ message: "Bo‘lim topilmadi" });

        await BolimModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Bo‘lim muvaffaqiyatli o‘chirildi ✅", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};
