const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer konfiguratsiyasi
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/youthNewsController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: YouthNews
 *   description: Yoshlar yangiliklarini boshqarish API
 */

/**
 * @swagger
 * /youthNews:
 *   post:
 *     summary: Yoshlar yangiliklari yaratish
 *     tags: [YouthNews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: "Mahalliy yoshlar yangiligi"
 *               title_ru:
 *                 type: string
 *                 example: "Новость для молодежи"
 *               title_oz:
 *                 type: string
 *                 example: "Mahalliy yoshlar yangiligi"
 *               desc_uz:
 *                 type: string
 *                 example: "Tadbir haqida batafsil ma’lumot"
 *               desc_ru:
 *                 type: string
 *                 example: "Подробная информация о мероприятии"
 *               desc_oz:
 *                 type: string
 *                 example: "Tadbir haqida batafsil ma’lumot"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Rasm yoki video fayllar (majburiy)
 *     responses:
 *       201:
 *         description: Yangilik muvaffaqiyatli yaratildi
 */
router.post("/", verifyToken,  (req, res, next) => {
  upload.array("media", 10) (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, create);

/**
 * @swagger
 * /youthNews:
 *   get:
 *     summary: Barcha yoshlar yangiliklari ro‘yxatini olish
 *     tags: [YouthNews]
 *     responses:
 *       200:
 *         description: Barcha yangiliklar ro‘yxati
 */
router.get("/", getAll);

/**
 * @swagger
 * /youthNews/{id}:
 *   get:
 *     summary: Yoshlar yangiligini ID bo‘yicha olish
 *     tags: [YouthNews]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Yangilik ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yangilik topildi
 *       404:
 *         description: Yangilik topilmadi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /youthNews/{id}:
 *   put:
 *     summary: Yoshlar yangiligini yangilash
 *     tags: [YouthNews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Yangilanishi kerak bo‘lgan yangilik ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
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
 *                 description: Yangi media yuklansa eskilari o‘chadi
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
 * /youthNews/{id}:
 *   delete:
 *     summary: Yoshlar yangiligini o‘chirish
 *     tags: [YouthNews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan yangilik ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yangilik o‘chirildi
 *       404:
 *         description: Yangilik topilmadi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
