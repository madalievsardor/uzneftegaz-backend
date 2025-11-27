const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

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

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
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
    else if (req.baseUrl.includes("/youthNews")) folder = "youthNews";
    else if (req.baseUrl.includes("/team")) folder = "team"
    else if (req.baseUrl.includes("/kasabaDocuments")) folder = "kasabaDocuments"
    else if (req.baseUrl.includes("/kasabaNews")) folder = "kasabaNews"
    else if (req.baseUrl.includes("/tadbirlar")) folder = "tadbirlar"
    else if (req.baseUrl.includes("/kasabaXodimlar")) folder = "kasabaXodimlar"

    const fileNameWithoutExt = path
      .parse(file.originalname)
      .name.replace(/\s+/g, "_")
      .replace(/[^\w\-]+/g, "");

    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder,
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${fileNameWithoutExt}`,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4"],
      
      // 📌 ***iPhone bilan 100% mos video transformatsiya***
      transformation: isVideo
        ? [{ format: "mp4", video_codec: "h264" }]
        : [],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Faqat rasm yoki video yuklash mumkin!"));
  },
});

module.exports = upload;
