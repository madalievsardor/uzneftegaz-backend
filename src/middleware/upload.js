const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path"); // <-- kengaytmani olib tashlash uchun

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
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

    // 🔹 Kengaytmani olib tashlaymiz — endi .mp4.mp4 bo‘lmaydi
    const fileNameWithoutExt = path.parse(file.originalname).name.replace(/\s+/g, "_");

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mov", "avi", "webm"],
      resource_type,
      public_id: `${Date.now()}-${fileNameWithoutExt}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Maks 50 MB
});

module.exports = upload;
