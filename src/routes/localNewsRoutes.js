const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer sozlamasi
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/localNewsController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: LocalNews
 *   description: Local yangiliklar (3 tilda)
 */

/**
 * @swagger
 * /localNews:
 *   post:
 *     summary: Yangi local yangilik yaratish
 *     tags: [LocalNews]
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
 *                 example: "Mahalliy yangilik"
 *               title_ru:
 *                 type: string
 *                 example: "Локальная новость"
 *               title_oz:
 *                 type: string
 *                 example: "Mahalliy yangilik (lotin)"
 *               desc_uz:
 *                 type: string
 *                 example: "Mahalliy yangilik tavsifi."
 *               desc_ru:
 *                 type: string
 *                 example: "Описание локальной новости."
 *               desc_oz:
 *                 type: string
 *                 example: "Mahalliy yangilik tavsifi (lotin)."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Yangilik muvaffaqiyatli yaratildi
 *       400:
 *         description: Xato yoki to‘ldirilmagan maydon
 */
router.post("/", verifyToken, (req, res, next) => {
  upload.array("images", 10) (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, create);

/**
 * @swagger
 * /localNews:
 *   get:
 *     summary: Barcha local yangiliklarni olish
 *     tags: [LocalNews]
 *     responses:
 *       200:
 *         description: Barcha local yangiliklar ro‘yxati
 */
router.get("/", getAll);

/**
 * @swagger
 * /localNews/{id}:
 *   get:
 *     summary: ID orqali bitta local yangilikni olish
 *     tags: [LocalNews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Local yangilik ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topilgan local yangilik
 *       404:
 *         description: Local yangilik topilmadi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /localNews/{id}:
 *   put:
 *     summary: Local yangilikni tahrirlash
 *     tags: [LocalNews]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanishi kerak bo‘lgan local yangilik ID si
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
router.put("/:id", verifyToken,  (req, res, next) => {
  upload.array("images", 10) (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, update);

/**
 * @swagger
 * /localNews/{id}:
 *   delete:
 *     summary: Local yangilikni o‘chirish
 *     tags: [LocalNews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan local yangilik ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Local yangilik muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Yangilik topilmadi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
