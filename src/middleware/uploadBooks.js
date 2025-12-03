// middleware/uploadBooks.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// 🔹 Ruxsat berilgan fayl turlari
const IMAGE_TYPES = [
  "image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"
];

const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed"
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const nameWithoutExt = path.parse(file.originalname).name.replace(/\s+/g, "_").replace(/[^\w\-]+/g, "");
    
    if (IMAGE_TYPES.includes(file.mimetype)) {
      return {
        folder: "books", // rasm uchun
        resource_type: "image",
        public_id: `${Date.now()}-${nameWithoutExt}`,
        allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"]
      };
    } else if (DOCUMENT_TYPES.includes(file.mimetype)) {
      return {
        folder: "documents/books", // hujjat uchun
        resource_type: "raw",
        public_id: `${Date.now()}-${nameWithoutExt}`,
        format: path.extname(file.originalname).substring(1),
        use_filename: true,
        unique_filename: false
      };
    } else {
      throw new Error("Faqat rasm yoki hujjat yuklash mumkin!");
    }
  }
});

const uploadBooks = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB limit
  fileFilter: (req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype) || DOCUMENT_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Faqat rasm yoki hujjat yuklash mumkin!"));
    }
  }
}).fields([
  { name: "mediaType", maxCount: 10 },
  { name: "mediaDocs", maxCount: 10 }
]);

module.exports = uploadBooks;
