const Vacancy = require("../models/vacancyModel");

// CREATE
exports.create = async (req, res) => {
  try {
    const { title, description, salary, requirements, deadline, salaryType } = req.body;

    // Faqat uz maydonlarini tekshiramiz
    if (
      !title?.uz ||
      !description?.uz ||
      !deadline ||
      !salaryType?.uz
    ) {
      return res.status(400).json({
        message: "Uzbek tilidagi (uz) maydonlar majburiy!",
      });
    }

    const vacancy = new Vacancy({
      title,
      description,
      salary,
      requirements,
      deadline,
      salaryType,
    });

    await vacancy.save();

    res.status(201).json({
      message: "Vakansiya muvaffaqiyatli yaratildi",
      vacancy,
    });
  } catch (error) {
    console.error("Error creating vacancy:", error);
    res.status(500).json({
      message: "Serverda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha vakansiyalar", vacancies });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy)
      return res.status(404).json({ message: "Vakansiya topilmadi" });
    res.status(200).json({ message: "Vakansiya topildi", vacancy });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const updateData = req.body;
    const vacancy = await Vacancy.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!vacancy)
      return res.status(404).json({ message: "Vakansiya topilmadi" });

    res.status(200).json({
      message: "Vakansiya yangilandi",
      vacancy,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
    if (!vacancy)
      return res.status(404).json({ message: "Vakansiya topilmadi" });

    res.status(200).json({ message: "Vakansiya o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};
