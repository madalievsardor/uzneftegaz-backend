// routes/xotinQizlarRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const uploadDocument = require("../middleware/uploadDocument"); // uploadDocument.js
const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/yoshlarSiyosatiController");

/**
 * @swagger
 * tags:
 *   name: Yoshlar siyosati
 *   description: Hujjatlar (PDF, DOC, DOCX, XLSX, ZIP) CRUD API
 */

/**
 * @swagger
 * /yoshlarSiyosati:
 *   post:
 *     summary: Yangi hujjat yaratish
 *     tags: [Yoshlar siyosati]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title_uz
 *               - decree_uz
 *               - description_uz
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF, DOC, DOCX, XLSX yoki ZIP fayl
 *               title_uz:
 *                 type: string
 *                 example: "Sarlavha (UZ)"
 *               title_ru:
 *                 type: string
 *                 example: "Заголовок (RU)"
 *               title_oz:
 *                 type: string
 *                 example: "Sarlavha (OZ)"
 *               decree_uz:
 *                 type: string
 *                 example: "Qonun (UZ)"
 *               decree_ru:
 *                 type: string
 *                 example: "Закон (RU)"
 *               decree_oz:
 *                 type: string
 *                 example: "Qonun (OZ)"
 *               description_uz:
 *                 type: string
 *                 example: "Tavsif (UZ)"
 *               description_ru:
 *                 type: string
 *                 example: "Описание (RU)"
 *               description_oz:
 *                 type: string
 *                 example: "Tavsif (OZ)"
 *     responses:
 *       201:
 *         description: Hujjat muvaffaqiyatli yaratildi
 *       400:
 *         description: Fayl yoki majburiy maydonlar kiritilmagan
 *       500:
 *         description: Server xatosi
 */
router.post("/", verifyToken, (req, res, next) => {
    uploadDocument.single("file")(req, res, (err) => {
      if (err) {
        // Multer xatolarini JSON ko‘rinishda qaytarish
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, create);

/**
 * @swagger
 * /yoshlarSiyosati:
 *   get:
 *     summary: Barcha hujjatlarni olish
 *     tags: [Yoshlar siyosati]
 *     responses:
 *       200:
 *         description: Barcha hujjatlar
 *       500:
 *         description: Server xatosi
 */
router.get("/",  getAll);

/**
 * @swagger
 * /yoshlarSiyosati/{id}:
 *   put:
 *     summary: Hujjatni yangilash
 *     tags: [Yoshlar siyosati]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Hujjat ID-si
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               decree_uz:
 *                 type: string
 *               decree_ru:
 *                 type: string
 *               decree_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto‘g‘ri ID yoki maydonlar
 *       404:
 *         description: Hujjat topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", verifyToken, (req, res, next) => {
    uploadDocument.single("file")(req, res, (err) => {
      if (err) {
        // Multer xatolarini JSON ko‘rinishda qaytarish
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, update);

/**
 * @swagger
 * /yoshlarSiyosati/{id}:
 *   delete:
 *     summary: Hujjatni o‘chirish
 *     tags: [Yoshlar siyosati]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Hujjat ID-si
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli o‘chirildi
 *       400:
 *         description: Noto‘g‘ri ID
 *       404:
 *         description: Hujjat topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
