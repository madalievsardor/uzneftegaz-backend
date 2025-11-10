const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer konfiguratsiyasi
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/newsController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Yangiliklar bo‘limi (3 tilda)
 */

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Yangi yangilik yaratish (uz, ru, oz)
 *     tags: [News]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: "Yangi loyiha boshlandi"
 *               title_ru:
 *                 type: string
 *                 example: "Начался новый проект"
 *               title_oz:
 *                 type: string
 *                 example: "Yangi loyiha boshlandi (lotin)"
 *               desc_uz:
 *                 type: string
 *                 example: "Bu loyiha energiya sohasida amalga oshirilmoqda."
 *               desc_ru:
 *                 type: string
 *                 example: "Этот проект реализуется в энергетической сфере."
 *               desc_oz:
 *                 type: string
 *                 example: "Bu loyiha energiya sohasida amalga oshirilmoqda (lotin)."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Yangilik muvaffaqiyatli yaratildi
 *       400:
 *         description: Majburiy maydon to‘ldirilmagan
 */
router.post("/", verifyToken,  (req, res, next) => {
  upload.array("images", 10) (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, create);

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Barcha yangiliklarni olish
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Barcha yangiliklar ro‘yxati
 */
router.get("/", getAll);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: ID orqali bitta yangilikni olish
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilik ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topilgan yangilik
 *       404:
 *         description: Yangilik topilmadi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Yangilikni tahrirlash (uz, ru, oz)
 *     tags: [News]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanishi kerak bo‘lgan yangilik ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               desc_uz:
 *                 type: string
 *               desc_ru:
 *                 type: string
 *               desc_oz:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Yangilik muvaffaqiyatli yangilandi
 *       404:
 *         description: Yangilik topilmadi
 */
router.put("/:id", verifyToken, (req, res, next) => {
  upload.array("images", 10) (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, update);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Yangilikni o‘chirish
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan yangilik ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yangilik muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Yangilik topilmadi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
