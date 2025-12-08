// middleware/uploadDocuments.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // cloudinary config faylingiz
const path = require("path");

// 🔹 Ruxsat berilgan fayl turlari (faqat hujjatlar)
const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
];

// 🔹 Fayl turi tekshiruvi
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

// 🔹 CloudinaryStorage sozlamasi
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "documents/others";

    // 🔸 URL bo‘yicha papka tanlash
    if (req.baseUrl.includes("/xotinQizlar")) folderName = "documents/xotinQizlar";
    else if (req.baseUrl.includes("/yoshlarSiyosati")) folderName = "documents/yoshlarSiyosati";
    else if (req.baseUrl.includes("/normative")) folderName = "documents/normative";
    else if (req.baseUrl.includes("/kasabaDocuments")) folderName = "documents/kasabaDocuments";
    else if (req.baseUrl.includes("/books")) folderName = "documents/books";

    return {
      folder: folderName,
      resource_type: "raw",       // muhim! PDF, DOCX, ZIP uchun
      access_mode: "public",      // muhim! Omma uchun
      public_id: `${Date.now()}-${path.parse(file.originalname).name.replace(/\s+/g, "_")}`,
      use_filename: false,
      unique_filename: true,
    };
  },
});

// 🔹 Multer sozlamasi
const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: 150 * 1024 * 1024 }, // 50 MB limit
});

module.exports = uploadDocuments;
