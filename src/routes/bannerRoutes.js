const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/bannerController");

/**
 * @swagger
 * tags:
 *   name: Banner
 *   description: Bannerlar (rasm/video) uchun CRUD API
 */

/**
 * @swagger
 * /banner/upload:
 *   post:
 *     summary: Rasm yoki video yuklab yangi banner yaratish (ko‘p tilda)
 *     tags: [Banner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title_uz
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Rasm yoki video fayl
 *               title_uz:
 *                 type: string
 *                 example: "Reklama banneri (UZ)"
 *               title_ru:
 *                 type: string
 *                 example: "Рекламный баннер (RU)"
 *               title_oz:
 *                 type: string
 *                 example: "Рекламный баннер (Oz)"
 *               desc_uz:
 *                 type: string
 *                 example: "Bu Uzbekcha tavsif"
 *               desc_ru:
 *                 type: string
 *                 example: "Это описание на русском"
 *               desc_oz:
 *                 type: string
 *                 example: "Бу кириллдаги тавсиф"
 *     responses:
 *       201:
 *         description: Banner muvaffaqiyatli yaratildi
 *       400:
 *         description: Fayl yoki majburiy maydonlar kiritilmagan
 *       500:
 *         description: Server xatosi
 */
router.post("/upload", verifyToken, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    console.log("req.file", req.file)
    if(err) return res.status(400).json({message: "File da error", error: err.message });
    next(); // create controller chaqiriladi
  });
}, create);

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Barcha bannerlarni olish
 *     tags: [Banner]
 *     responses:
 *       200:
 *         description: Barcha bannerlar muvaffaqiyatli olindi
 *       500:
 *         description: Server xatosi
 */
router.get("/", getAll);

/**
 * @swagger
 * /banner/{id}:
 *   get:
 *     summary: ID orqali bitta banner olish
 *     tags: [Banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bannerning ID si
 *     responses:
 *       200:
 *         description: Banner topildi
 *       404:
 *         description: Banner topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /banner/update/{id}:
 *   put:
 *     summary: Banner ma'lumotlarini yangilash (faylni ham almashtirish mumkin)
 *     tags: [Banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bannerning ID si
 *     requestBody:
 *       required: true
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
 *                 example: "Yangilangan banner"
 *               title_ru:
 *                 type: string
 *                 example: "Обновленный баннер"
 *               title_oz:
 *                 type: string
 *                 example: "Янгиланган баннер"
 *               description_uz:
 *                 type: string
 *                 example: "Yangi ma’lumotlar bilan banner"
 *               description_ru:
 *                 type: string
 *                 example: "Баннер с новой информацией"
 *               description_oz:
 *                 type: string
 *                 example: "Янги маълумотлар билан баннер"
 *     responses:
 *       200:
 *         description: Banner muvaffaqiyatli yangilandi
 *       404:
 *         description: Banner topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/update/:id", verifyToken, (req, res, next) => {
  upload.single("file") (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next();
  })
}, update);

/**
 * @swagger
 * /banner/delete/{id}:
 *   delete:
 *     summary: Banner o‘chirish
 *     tags: [Banner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bannerning ID si
 *     responses:
 *       200:
 *         description: Banner o‘chirildi
 *       404:
 *         description: Banner topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/delete/:id", verifyToken, remove);

module.exports = router;
