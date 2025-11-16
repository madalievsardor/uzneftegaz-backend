const Hisobot = require("../models/hisobotModel");
const mongoose = require("mongoose");
exports.create = async (req, res) => {
  try {
    const {
      startMonth_uz,
      startMonth_oz,
      startMonth_ru,
      endMonth_uz,
      endMonth_oz,
      endMonth_ru,
      plan_uz,
      plan_oz,
      plan_ru,
      title_uz,
      title_oz,
      title_ru,
      description_uz,
      description_oz,
      description_ru,
      participantsCount,
    } = req.body;
    if (!startMonth_uz || !endMonth_uz || !title_uz || !description_uz) {
      const missingFields = [];
      if (!startMonth_uz) missingFields.push("startMonth_uz");
      if (!endMonth_uz) missingFields.push("endMonth_uz");
      if (!title_uz) missingFields.push("title_uz");
      if (!description_uz) missingFields.push("description_uz");
      return res.status(400).json({
        message: `Quyidagi maydonlar to'ldirilmagan ${missingFields.join(
          ", "
        )}`,
        missingFields,
      });
    }

    const allowedUz = [
      "Режалаштирилган",
      "Бажарилмоқда",
      "Бажарилди",
      "Бажарилмади",
    ];
    const allowedOz = [
      "Rejalashtirilgan",
      "Bajarilmoqda",
      "Bajarildi",
      "Bajarilmadi",
    ];
    const allowedRu = [
      "Запланировано",
      "Выполняется",
      "Выполнено",
      "Не выполнено",
    ];

    if (!allowedUz.includes(plan_uz)) {
      return res.status(400).json({
        message:
          "plan_uz faqat 'Режалаштирилган' yoki 'Бажарилмоқда' yoki 'Бажарилди' yoki 'Бажарилмади' bo'lishi kerak",
      });
    }
    if (plan_oz && !allowedOz.includes(plan_oz)) {
      return res.status(400).json({
        message:
          "plan_oz faqat 'Rejalashtirilgan' yoki 'Bajarilmoqda' yoki 'Bajarildi' yoki 'Bajarilmadi' bo'lishi kerak",
      });
    }
    if (plan_ru && !allowedRu.includes(plan_ru)) {
      return res.status(400).json({
        message:
          "plan_ru faqat 'Запланировано' yoki 'Выполняется' yoki 'Выполнено' yoki 'Не выполнено' bo'lishi kerak",
      });
    }
    if (participantsCount && isNaN(participantsCount)) {
      return res.status(400).json({
        message: "Ishtirokchi soni raqam bo'lishi kerak",
      });
    }

    const newReports = await Hisobot({
      startMonth: { uz: startMonth_uz, oz: startMonth_oz, ru: startMonth_ru },
      endMonth: { uz: endMonth_uz, oz: endMonth_oz, ru: endMonth_ru },
      plan: { uz: plan_uz, oz: plan_oz, ru: plan_ru },
      title: { uz: title_uz, oz: title_oz, ru: title_ru },
      description: {
        uz: description_uz,
        oz: description_oz,
        ru: description_ru,
      },
      participantsCount: participantsCount || 0,
    });
    await newReports.save();
    res.status(201).json({
      message: `Ma'lumot muvaffaqiyatli yaratildi!`,
      newReports,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const reports = await Hisobot.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha hisbotlar", reports });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const report = await Hisobot.findById(id);
    if (!report)
      return res.status(404).json({ message: "Ma'lumot topilmadi!" });
    const {
      startMonth_uz,
      startMonth_oz,
      startMonth_ru,
      endMonth_uz,
      endMonth_oz,
      endMonth_ru,
      plan_uz,
      plan_oz,
      plan_ru,
      title_uz,
      title_oz,
      title_ru,
      description_uz,
      description_oz,
      description_ru,
      participantsCount,
    } = req.body;
    if (!startMonth_uz || !endMonth_uz || !title_uz || !description_uz) {
      const missingFields = [];
      if (!startMonth_uz) missingFields.push("startMonth_uz");
      if (!endMonth_uz) missingFields.push("endMonth_uz");
      if (!title_uz) missingFields.push("title_uz");
      if (!description_uz) missingFields.push("description_uz");
      return res.status(400).json({
        message: `Quyidagi maydonlar to'ldirilmagan ${missingFields.join(
          ", "
        )}`,
        missingFields,
      });
    }

    const allowedUz = [
      "Режалаштирилган",
      "Бажарилмоқда",
      "Бажарилди",
      "Бажарилмади",
    ];
    const allowedOz = [
      "Rejalashtirilgan",
      "Bajarilmoqda",
      "Bajarildi",
      "Bajarilmadi",
    ];
    const allowedRu = [
      "Запланировано",
      "Выполняется",
      "Выполнено",
      "Не выполнено",
    ];

    if (!allowedUz.includes(plan_uz)) {
      return res.status(400).json({
        message:
          "plan_uz faqat 'Режалаштирилган' yoki 'Бажарилмоқда' yoki 'Бажарилди' yoki 'Бажарилмади' bo'lishi kerak",
      });
    }
    if (plan_oz && !allowedOz.includes(plan_oz)) {
      return res.status(400).json({
        message:
          "plan_oz faqat 'Rejalashtirilgan' yoki 'Bajarilmoqda' yoki 'Bajarildi' yoki 'Bajarilmadi' bo'lishi kerak",
      });
    }
    if (plan_ru && !allowedRu.includes(plan_ru)) {
      return res.status(400).json({
        message:
          "plan_ru faqat 'Запланировано' yoki 'Выполняется' yoki 'Выполнено' yoki 'Не выполнено' bo'lishi kerak",
      });
    }
    if (participantsCount !== undefined) {
      if (isNaN(Number(participantsCount))) {
        return res.status(400).json({
          message: "Ishtirokchi soni faqat raqam bo'lishi kerak!",
        });
      }
      report.participantsCount = Number(participantsCount);
    }
    if (startMonth_oz || startMonth_uz || startMonth_ru) {
      report.startMonth = {
        uz: startMonth_uz ?? report.startMonth.uz,
        oz: startMonth_oz ?? report.startMonth.oz,
        ru: startMonth_ru ?? report.startMonth.ru,
      };
    }
    if (endMonth_oz || endMonth_uz || endMonth_ru) {
      report.endMonth = {
        uz: endMonth_uz ?? report.endMonth.uz,
        oz: endMonth_oz ?? report.endMonth.oz,
        ru: endMonth_ru ?? report.endMonth.ru,
      };
    }
    if (plan_uz || plan_oz || plan_ru)
      report.category = {
        uz: plan_uz ?? report.plan.uz,
        oz: plan_oz ?? report.plan.oz,
        ru: plan_ru ?? report.plan.ru,
      };

    if (title_uz || title_oz || title_ru)
      report.title = {
        uz: title_uz ?? report.title.uz,
        oz: title_oz ?? report.title.oz,
        ru: title_ru ?? report.title.ru,
      };

    if (description_uz || description_oz || description_ru)
      report.description = {
        uz: description_uz ?? report.description.uz,
        oz: description_oz ?? report.description.oz,
        ru: description_ru ?? report.description.ru,
      };
    if (participantsCount !== undefined) {
      report.participantsCount = participantsCount;
    }
    await report.save();
    res
      .status(200)
      .json({
        message: `Ma'lumot muvaffaqiyatli yangilandi!`,
        report,
      });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" })
    }
    const report = await Hisobot.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: "Ma'lumot topilmadi!" })
    }
    res.status(200).json({ message: `Ma'lumot muvaffaqiyatli o'chirildi.` })
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message })
  }
}
