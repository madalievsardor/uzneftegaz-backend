const express = require("express");
const router = express.Router();

const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/sportController");

/**
 * @swagger
 * tags:
 *   name: Sport
 *   description: Sport va madaniyat bo‘yicha API
 */

/**
 * @swagger
 * /sport/create:
 *   post:
 *     tags: [Sport]
 *     summary: Yangi sport/madaniyat ma'lumot yaratish
 *     description: |
 *       Kategoriya faqat quyidagilar bo‘lishi mumkin:  
 *       - **UZ:** Спорт, Маданият  
 *       - **OZ:** Sport, Madaniyat  
 *       - **RU:** Спорт, Культура  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title_uz
 *               - place_uz
 *               - description_uz
 *               - athlete_uz
 *               - category_uz
 *             properties:
 *               title_uz: { type: string }
 *               title_oz: { type: string }
 *               title_ru: { type: string }
 *               place_uz: { type: string }
 *               place_oz: { type: string }
 *               place_ru: { type: string }
 *               description_uz: { type: string }
 *               description_oz: { type: string }
 *               description_ru: { type: string }
 *               athlete_uz: { type: string }
 *               athlete_oz: { type: string }
 *               athlete_ru: { type: string }
 *               category_uz: 
 *                 type: string
 *                 example: "Спорт"
 *               category_oz:
 *                 type: string
 *                 example: "Sport"
 *               category_ru:
 *                 type: string
 *                 example: "Спорт"
 *     responses:
 *       201:
 *         description: Ma'lumot yaratildi
 *       400:
 *         description: Xatolik — noto‘g‘ri kategoriya yoki bo‘sh maydon
 *       500:
 *         description: Server xatoligi
 */
router.post("/create", create);

/**
 * @swagger
 * /sport/all:
 *   get:
 *     tags: [Sport]
 *     summary: Barcha sport/madaniyat ma'lumotlarni olish
 *     responses:
 *       200:
 *         description: Ma'lumotlar ro‘yxati
 *       500:
 *         description: Server xatoligi
 */
router.get("/all", getAll);

/**
 * @swagger
 * /sport/update/{id}:
 *   put:
 *     tags: [Sport]
 *     summary: Sport/madaniyat ma'lumotini yangilash
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yangilanadigan ma'lumot IDsi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz: { type: string }
 *               title_oz: { type: string }
 *               title_ru: { type: string }
 *               place_uz: { type: string }
 *               place_oz: { type: string }
 *               place_ru: { type: string }
 *               description_uz: { type: string }
 *               description_oz: { type: string }
 *               description_ru: { type: string }
 *               athlete_uz: { type: string }
 *               athlete_oz: { type: string }
 *               athlete_ru: { type: string }
 *               category_uz:
 *                 type: string
 *                 example: "Спорт"
 *               category_oz:
 *                 type: string
 *                 example: "Sport"
 *               category_ru:
 *                 type: string
 *                 example: "Спорт"
 *     responses:
 *       200:
 *         description: Ma'lumot muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto‘g‘ri kategoriya yoki xato ID
 *       404:
 *         description: Ma'lumot topilmadi
 *       500:
 *         description: Server xatoligi
 */
router.put("/update/:id", update);

/**
 * @swagger
 * /sport/delete/{id}:
 *   delete:
 *     tags: [Sport]
 *     summary: Sport/madaniyat ma'lumotini o‘chirish
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Ma'lumot topilmadi
 *       400:
 *         description: ID noto‘g‘ri formatda
 *       500:
 *         description: Server xatoligi
 */
router.delete("/delete/:id", remove);

module.exports = router;
