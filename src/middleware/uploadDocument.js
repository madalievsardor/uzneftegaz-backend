// middleware/uploadDocument.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (req.baseUrl.includes("/xotinQizlar")) {
      folderPath = path.join(__dirname, "../uploads/xotinQizlar");
    } else if (req.baseUrl.includes("/yoshlarSiyosati")) {
      folderPath = path.join(__dirname, "../uploads/yoshlarSiyosati");
    } else if (req.baseUrl.includes("/normative")) {
      folderPath = path.join(__dirname, "../uploads/files");
    } else {
      folderPath = path.join(__dirname, "../uploads/others");
    }

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log("📁 Yangi papka yaratildi:", folderPath);
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Faqat PDF, DOC, DOCX, XLSX yoki ZIP formatdagi fayllarni yuklash mumkin!"
      ),
      false
    );
  }
};

const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = uploadDocuments;
