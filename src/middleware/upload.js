// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

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

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "gif", "mp4", "mov", "avi", "webm"],
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
