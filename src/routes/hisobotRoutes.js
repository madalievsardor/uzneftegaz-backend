const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/hisobotController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Hisobot
 *   description: Hisobotlar bo‘yicha 
 */

/**
 * @swagger
 * /hisobot:
 *   post:
 *     summary: Yangi hisobot yaratish
 *     tags: [Hisobot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startMonth_uz
 *               - endMonth_uz
 *               - title_uz
 *               - description_uz
 *               - plan_uz
 *             properties:
 *               startMonth_uz:
 *                 type: string
 *                 example: Yanvar
 *               startMonth_oz:
 *                 type: string
 *               startMonth_ru:
 *                 type: string
 *               endMonth_uz:
 *                 type: string
 *               endMonth_oz:
 *                 type: string
 *               endMonth_ru:
 *                 type: string
 *               plan_uz:
 *                 type: string
 *                 enum: ["Режалаштирилган","Бажарилмоқда","Бажарилди","Бажарилмади"]
 *               plan_oz:
 *                 type: string
 *                 enum: ["Rejalashtirilgan", "Bajarilmoqda", "Bajarildi", "Bajarilmadi"]
 *               plan_ru:
 *                 type: string
 *                 enum: ["Запланировано", "Выполняется", "Выполнено", "Не выполнено"]
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
 *               participantsCount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Hisobot yaratildi
 */
router.post("/", verifyToken, create);

/**
 * @swagger
 * /hisobot:
 *   get:
 *     summary: Barcha hisobotlarni olish
 *     tags: [Hisobot]
 *     responses:
 *       200:
 *         description: Hisobotlar ro‘yxati
 */
router.get("/", getAll);

/**
 * @swagger
 * /hisobot/{id}:
 *   put:
 *     summary: Hisobotni yangilash
 *     tags: [Hisobot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanadigan hisobot IDsi
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
 *                 example: "Yanvar"
 *               startMonth_oz:
 *                 type: string
 *                 example: "Yanvar"
 *               startMonth_ru:
 *                 type: string
 *                 example: "Январь"
 * 
 *               endMonth_uz:
 *                 type: string
 *                 example: "Fevral"
 *               endMonth_oz:
 *                 type: string
 *                 example: "Fevral"
 *               endMonth_ru:
 *                 type: string
 *                 example: "Февраль"
 * 
 *               plan_uz:
 *                 type: string
 *                 enum: ["Режалаштирилган", "Бажарилмоқда", "Бажарилди", "Бажарилмади"]
 *                 example: "Бажарилди"
 *               plan_oz:
 *                 type: string
 *                 enum: ["Rejalashtirilgan", "Bajarilmoqda", "Bajarildi", "Bajarilmadi"]
 *                 example: "Bajarildi"
 *               plan_ru:
 *                 type: string
 *                 enum: ["Запланировано", "Выполняется", "Выполнено", "Не выполнено"]
 *                 example: "Выполнено"
 * 
 *               title_uz:
 *                 type: string
 *                 example: "Hisobot nomi"
 *               title_oz:
 *                 type: string
 *                 example: "Hisobot nomi"
 *               title_ru:
 *                 type: string
 *                 example: "Название отчета"
 * 
 *               description_uz:
 *                 type: string
 *                 example: "Hisobot tavsifi"
 *               description_oz:
 *                 type: string
 *                 example: "Hisobot tavsifi"
 *               description_ru:
 *                 type: string
 *                 example: "Описание отчета"
 * 
 *               participantsCount:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli yangilandi
 *       400:
 *         description: Xatolik, noto‘g‘ri maʼlumot
 *       404:
 *         description: Maʼlumot topilmadi
 */
router.put("/:id", verifyToken, update);
/**
 * @swagger
 * /hisobot/{id}:
 *   delete:
 *     summary: Hisobotni o‘chirish
 *     tags: [Hisobot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: O‘chirildi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router