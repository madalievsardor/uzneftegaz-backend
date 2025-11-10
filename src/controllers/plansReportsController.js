const plansReportsModel = require("../models/plansReportsModel");
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
      category_uz,
      category_oz,
      category_ru,
      title_uz,
      title_oz,
      title_ru,
      description_uz,
      description_oz,
      description_ru,
      participantsCount
    } = req.body;
    if (!startMonth_uz || !endMonth_uz || !category_uz || !title_uz || !description_uz) {
      const missingFields = [];
      if (!startMonth_uz) missingFields.push("startMonth_uz");
      if (!endMonth_uz) missingFields.push("endMonth_uz");
      if (!category_uz) missingFields.push("category_uz");
      if (!title_uz) missingFields.push("title_uz");
      if (!description_uz) missingFields.push("description_uz");
      return res.status(400).json({ message: `Quyidagi maydonlar to'ldirilmagan ${missingFields.join(", ")}`, missingFields })
    }
    if (category_uz) {
      const allowedCategories = ["Режа", "Хисобот"];
      if (!allowedCategories.includes(category_uz)) {
        return res.status(400).json({
          message: "Noto'g'ri category_uz faqat 'Режа' yoki Хисобот kiritish mumkun "
        })
      }
    }
    if (participantsCount && isNan(participantsCount)) {
      return res.status(400).json({
        message: "Ishtirokchi soni raqam bo'lishi kerak"
      });
    }

    const newReports = await plansReportsModel({
      startMonth: { uz: startMonth_uz, oz: startMonth_oz, ru: startMonth_ru },
      endMonth: { uz: endMonth_uz, oz: endMonth_oz, ru: endMonth_ru },
      category: { uz: category_uz, oz: category_oz, ru: category_ru },
      title: { uz: title_uz, oz: title_oz, ru: title_ru },
      description: { uz: description_uz, oz: description_oz, ru: description_ru },
      participantsCount: participantsCount || 0
    });

    await newReports.save();
    res.status(201).json({ message: `${category_oz} bo'yicha ma'lumot yaratildi!`, newReports })
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik", error: e.message })
  }
}

exports.getAll = async (req, res) => {
  try {
    const reports = await plansReportsModel.find();
    res.status(200).json({ message: "Barcha reja va hisbotlar", reports })

  } catch (e) {
    return res.status(500).json({ message: "Serverda xatolik", error: e.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" })
    };

    const report = await plansReportsModel.findById(id);
    if (!report) return res.status(404).json({ message: "Ma'lumot topilmadi!" });

    const {
      startMonth_uz,
      startMonth_oz,
      startMonth_ru,
      endMonth_uz,
      endMonth_oz,
      endMonth_ru,
      category_uz,
      category_oz,
      category_ru,
      title_uz,
      title_oz,
      title_ru,
      description_uz,
      description_oz,
      description_ru,
      participantsCount
    } = req.body;

    if (category_uz) {
      const allowedCategories = ["Режа", "Хисобот"]
      if (!allowedCategories.includes(category_uz)) {
        return res.status(400).json({
          message: "Noto'g'ri category_uz! faqat 'Режа', 'Хисобот'  kiritish mumkun",
        })
      }
    }

    if (participantsCount || isNaN(participantsCount)) {
      return res.status(400).json({
        message: "Ishtirokchi soni raqam bo'lishi kerak"
      })
    };

    if (startMonth_oz || startMonth_uz || startMonth_ru) {
      report.startMonth = {
        uz: startMonth_uz ?? report.startMonth.uz,
        oz: startMonth_oz ?? report.startMonth.oz,
        ru: startMonth_ru ?? report.startMonth.ru
      }
    }
    if (endMonth_oz || endMonth_uz || endMonth_ru) {
      report.endMonth = {
        uz: endMonth_uz ?? report.endMonth.uz,
        oz: endMonth_oz ?? report.endMonth.oz,
        ru: endMonth_ru ?? report.endMonth.ru
      }
    }
    if (category_uz || category_oz || category_ru)
      report.category = {
        uz: category_uz ?? report.category.uz,
        oz: category_oz ?? report.category.oz,
        ru: category_ru ?? report.category.ru,
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
      if(participantsCount !== undefined) {
        report.participantsCount = participantsCount
      }

      await report.save();
      res.status(200).json({message: `${report.category.oz} bo'yicha ma'lumot muvaffaqiyatli yangilandi!`, report})
  } catch (e) {
    return res.status(500).json({ message: "Serverda xatolik", error: e.message })
  }
}

exports.remove = async (req, res) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Noto'g'ri ID format"})
    }
    const report = await plansReportsModel.findByIdAndUpdate(id);
    if(!report) {
      return res.status(404).json({message: "Ma'lumot topilmadi!"})
    }
    res.status(200).json({message: `${report.category.oz} muvaffaqiyatli o'chirildi.`})
  } catch(e) {
    res.status(500).json({message: "Serverda xatolik", error: e.message})
  }
}