const express = require("express");
const router = express.Router();
const genderController = require("../controllers/genderController");
const upload = require("../middleware/upload"); // multer middleware
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Gender tengligi
 *   description: Gender bo‘yicha CRUD amallar
 */

/**
 * @swagger
 * /gender/:
 *   post:
 *     summary: Yangi gender ma'lumotini yaratish
 *     tags: [Gender tengligi]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: Gender siyosati
 *               title_oz:
 *                 type: string
 *                 example: Gender siyosati (lotin)
 *               title_ru:
 *                 type: string
 *                 example: Гендерная политика
 *               description_uz:
 *                 type: string
 *                 example: Bu gender tengligi haqidagi ma'lumot.
 *               description_oz:
 *                 type: string
 *                 example: Bu gender tengligi haqidagi ma'lumot (lotin).
 *               description_ru:
 *                 type: string
 *                 example: Информация о гендерном равенстве.
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Yangi gender ma'lumot yaratildi
 *       400:
 *         description: Noto‘g‘ri so‘rov
 *       500:
 *         description: Server xatosi
 */
router.post("/", verifyToken, (req, res, next) => {
    upload.single("file") (req, res, (err) => {
        if(err) {
            return res.status(400).json({message: err.message})
        }
        next();
    })
}, genderController.create);

/**
 * @swagger
 * /gender/:
 *   get:
 *     summary: Barcha gender ma'lumotlarini olish
 *     tags: [Gender tengligi]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *       500:
 *         description: Server xatosi
 */
router.get("/", genderController.getAll);

/**
 * @swagger
 * /gender/{id}:
 *   put:
 *     summary: Gender ma'lumotini yangilash
 *     tags: [Gender tengligi]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gender ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               title_ru:
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
 *       200:
 *         description: Muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto‘g‘ri ID yoki ma'lumot
 *       404:
 *         description: Topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", verifyToken, (req, res, next) => {
    upload.single("file") (req, res, (err) => {
        if(err) {
            return res.status(400).json({message: err.message})
        }
        next();
    })
}, genderController.update);

/**
 * @swagger
 * /gender/{id}:
 *   delete:
 *     summary: Gender ma'lumotini o‘chirish
 *     tags: [Gender tengligi]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gender ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli o‘chirildi
 *       400:
 *         description: Noto‘g‘ri ID format
 *       404:
 *         description: Ma'lumot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, genderController.remove);

module.exports = router;
