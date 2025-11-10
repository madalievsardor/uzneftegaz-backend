// routes/plansReportsRoutes.js
const express = require("express");
const router = express.Router();
const plansReportsController = require("../controllers/plansReportsController");
const { verifyToken } = require("../middleware/authMiddleware")
// 🟢 Create
/**
 * @swagger
 * /plansReports:
 *   post:
 *     summary: Reja yoki Hisobot yaratish (uz, ru, oz tillarda)
 *     tags: [Rejalar va Hisobotlar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startMonth_uz:
 *                 type: string
 *               startMonth_ru:
 *                 type: string
 *               startMonth_oz:
 *                 type: string
 *               endMonth_uz:
 *                 type: string
 *               endMonth_ru:
 *                 type: string
 *               endMonth_oz:
 *                 type: string
 *               category_uz:
 *                 type: string
 *                 enum: ["Режа", "Хисобот"]
 *               category_ru:
 *                 type: string
 *                 enum: ["План", "Отчет"]
 *               category_oz:
 *                 type: string
 *                 enum: ["Reja", "Hisobot"]
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *               participantsCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reja yoki Hisobot muvaffaqiyatli yaratildi
 *       400:
 *         description: Majburiy maydonlar to'ldirilmagan yoki noto'g'ri ma'lumot
 *       500:
 *         description: Server xatosi
 */
router.post("/", verifyToken, plansReportsController.create);

// 🟢 Get All
/**
 * @swagger
 * /plansReports:
 *   get:
 *     summary: Barcha reja va hisobotlarni olish
 *     tags: [Rejalar va Hisobotlar]
 *     responses:
 *       200:
 *         description: Barcha reja va hisobotlar
 *       500:
 *         description: Server xatosi
 */
router.get("/", plansReportsController.getAll);

// 🟢 Update
/**
 * @swagger
 * /plansReports/{id}:
 *   put:
 *     summary: Reja yoki Hisobotni yangilash
 *     tags: [Rejalar va Hisobotlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanishi kerak bo'lgan reja/hisobot ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startMonth_uz:
 *                 type: string
 *               startMonth_ru:
 *                 type: string
 *               startMonth_oz:
 *                 type: string
 *               endMonth_uz:
 *                 type: string
 *               endMonth_ru:
 *                 type: string
 *               endMonth_oz:
 *                 type: string
 *               category_uz:
 *                 type: string
 *                 enum: ["Режа", "Хисобот"]
 *               category_ru:
 *                 type: string
 *                 enum: ["План", "Отчет"]
 *               category_oz:
 *                 type: string
 *                 enum: ["Reja", "Hisobot"]
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *               participantsCount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Reja yoki Hisobot muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto'g'ri so'rov
 *       404:
 *         description: Reja/hisobot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", verifyToken, plansReportsController.update);

// 🟢 Delete
/**
 * @swagger
 * /plansReports/{id}:
 *   delete:
 *     summary: Reja yoki Hisobotni o'chirish
 *     tags: [Rejalar va Hisobotlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O'chirilishi kerak bo'lgan reja/hisobot ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reja yoki Hisobot muvaffaqiyatli o'chirildi
 *       400:
 *         description: Noto'g'ri ID format
 *       404:
 *         description: Reja/hisobot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, plansReportsController.remove);

module.exports = router;
