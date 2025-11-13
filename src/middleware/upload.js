const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// ✅ Ruxsat etilgan MIME turlar
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/webm",
];

// 🔹 Cloudinary Storage sozlamasi
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 🔸 Fayl turi ruxsat etilganini tekshiramiz
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error("Faqat rasm yoki video yuklash mumkin!");
    }

    let folder = "others";
    if (req.baseUrl.includes("/news")) folder = "news";
    else if (req.baseUrl.includes("/localNews")) folder = "localNews";
    else if (req.baseUrl.includes("/industryNews")) folder = "industryNews";
    else if (req.baseUrl.includes("/banner")) folder = "banners";
    else if (req.baseUrl.includes("/normative")) folder = "files";
    else if (req.baseUrl.includes("/honorary")) folder = "honorary";
    else if (req.baseUrl.includes("/leader")) folder = "leaders";
    else if (req.baseUrl.includes("/gender")) folder = "gender";

    const resource_type = file.mimetype.startsWith("video/") ? "video" : "image";

    // 🔹 Fayl nomini kengaytmasiz va bo‘shliqsiz qilib olamiz
    const fileNameWithoutExt = path.parse(file.originalname).name.replace(/\s+/g, "_");

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mov", "avi", "webm"],
      resource_type,
      public_id: `${Date.now()}-${fileNameWithoutExt}`,
    };
  },
});

// 🔹 Multer konfiguratsiyasi
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Maks 50 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Faqat rasm (jpg, png, webp) yoki video (mp4, mov, webm) yuklash mumkin!"));
    }
  },
});

module.exports = upload;