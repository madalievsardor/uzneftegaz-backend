const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/xotinQizlarController");
const uploadDocument = require("../middleware/uploadDocument");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: XotinQizlar
 *   description: Xotin va qizlar siyosatiga oid hujjatlar API
 */

/**
 * @swagger
 * /xotinQizlar:
 *   post:
 *     summary: Yangi hujjat yaratish
 *     tags: [XotinQizlar]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title_uz
 *               - decree_uz
 *               - description_uz
 *               - file
 *             properties:
 *               title_uz:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               decree_uz:
 *                 type: string
 *               decree_oz:
 *                 type: string
 *               decree_ru:
 *                 type: string
 *               description_uz:
 *                 type: string
 *               description_oz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Ma'lumot muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto‘g‘ri ma'lumot
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
 * /xotinQizlar:
 *   get:
 *     summary: Barcha hujjatlarni olish
 *     tags: [XotinQizlar]
 *     responses:
 *       200:
 *         description: Barcha hujjatlar ro‘yxati
 */
router.get("/", getAll);

/**
 * @swagger
 * /xotinQizlar/{id}:
 *   put:
 *     summary: Mavjud hujjatni yangilash
 *     tags: [XotinQizlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hujjatning ID raqami
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: Xotin-qizlar siyosatiga oid yangi farmon
 *               title_oz:
 *                 type: string
 *                 example: Xotin-qizlar siyosati farmoni (lotin)
 *               title_ru:
 *                 type: string
 *                 example: Указ о политике женщин
 *               decree_uz:
 *                 type: string
 *                 example: PF-123-son Prezident farmoni
 *               decree_oz:
 *                 type: string
 *                 example: PF-123 sonli Prezident farmoni
 *               decree_ru:
 *                 type: string
 *                 example: Указ Президента № PF-123
 *               description_uz:
 *                 type: string
 *                 example: Xotin-qizlar siyosatiga oid asosiy yangilangan hujjat
 *               description_oz:
 *                 type: string
 *                 example: Asosiy hujjat (lotin)
 *               description_ru:
 *                 type: string
 *                 example: Основной документ по политике женщин
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Faqat PDF, DOC, DOCX, XLSX yoki ZIP formatdagi fayllar qabul qilinadi
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto‘g‘ri ID yoki fayl turi
 *       404:
 *         description: Ma'lumot topilmadi
 */
router.put("/:id", verifyToken, (req, res, next) => {
    uploadDocument.single("file")(req, res, (err) => {
        if (err) {
          // Multer xatolarini JSON ko‘rinishda qaytarish
          return res.status(400).json({ message: err.message });
        }
        next();
      });
} , update);


/**
 * @swagger
 * /xotinQizlar/{id}:
 *   delete:
 *     summary: Hujjatni o‘chirish
 *     tags: [XotinQizlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hujjatning ID raqami
 *     responses:
 *       200:
 *         description: Hujjat o‘chirildi
 *       404:
 *         description: Ma'lumot topilmadi
 */
router.delete("/:id", remove);

module.exports = router;
