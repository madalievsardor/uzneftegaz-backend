const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Cloudinary uchun TEMP yuklab olish
const { verifyToken } = require("../middleware/authMiddleware")

const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/kasabaTadbirlarController");

/**
 * @swagger
 * tags:
 *   name: KasabaTadbirlar
 *   description: Kasaba uyushmasi tadbirlari bo‘yicha API
 */

/**
 * @swagger
 * /tadbirlar/create:
 *   post:
 *     tags: [KasabaTadbirlar]
 *     summary: Yangi tadbir yaratish
 *     description: Rasm va videolarni yuklash imkoniyati bor (Cloudinary).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title_uz
 *               - description_uz
 *               - category_uz
 *               - users
 *               - location_uz
 *               - time
 *             properties:
 *               title_uz: { type: string }
 *               title_ru: { type: string }
 *               title_oz: { type: string }
 *               description_uz: { type: string }
 *               description_ru: { type: string }
 *               description_oz: { type: string }
 *               date: { type: string, example: "2025-01-01" }
 *               time: { type: string, example: "14:00" }
 *               location_uz: { type: string }
 *               location_ru: { type: string }
 *               location_oz: { type: string }
 *               category_uz: { type: string }
 *               category_ru: { type: string }
 *               category_oz: { type: string }
 *               users: { type: string }
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201: { description: Tadbir muvaffaqiyatli yaratildi }
 *       400: { description: Kerakli maydonlar to‘ldirilmagan }
 *       500: { description: Serverda xatolik }
 */
router.post("/create", verifyToken,  (req, res, next) => {
  upload.array("file")(req, res, (err) => {
    console.log("req.file", req.file)
    if(err) return res.status(400).json({message: "File da error", error: err.message });
    next(); // create controller chaqiriladi
  });
}, create)

/**
 * @swagger
 * /tadbirlar/all:
 *   get:
 *     tags: [KasabaTadbirlar]
 *     summary: Barcha tadbirlarni olish
 *     responses:
 *       200: { description: Barcha tadbirlar qaytariladi }
 *       500: { description: Server xatosi }
 */
router.get("/all", getAll);

/**
 * @swagger
 * /tadbirlar/{id}:
 *   put:
 *     tags: [KasabaTadbirlar]
 *     summary: Tadbirni yangilash
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Yangilanadigan tadbir IDsi
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz: { type: string }
 *               title_ru: { type: string }
 *               title_oz: { type: string }
 *               description_uz: { type: string }
 *               description_ru: { type: string }
 *               description_oz: { type: string }
 *               date: { type: string, format: date }
 *               time: { type: string }
 *               location_uz: { type: string }
 *               location_ru: { type: string }
 *               location_oz: { type: string }
 *               category_uz: { type: string }
 *               category_ru: { type: string }
 *               category_oz: { type: string }
 *               users: { type: string }
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200: { description: Tadbir muvaffaqiyatli yangilandi }
 *       400: { description: ID noto‘g‘ri formatda }
 *       404: { description: Ma'lumot topilmadi }
 *       500: { description: Server xatosi }
 */
router.put("/:id", verifyToken,  (req, res, next) => {
  upload.array("file")(req, res, (err) => {
    console.log("req.file", req.file)
    if(err) return res.status(400).json({message: "File da error", error: err.message });
    next(); // create controller chaqiriladi
  });
}, update)


/**
 * @swagger
 * /tadbirlar/{id}:
 *   delete:
 *     tags: [KasabaTadbirlar]
 *     summary: Tadbirni o‘chirish
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: O‘chirildi
 *       404:
 *         description: Ma'lumot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
