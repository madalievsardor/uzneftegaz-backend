const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/vacancyController");

/**
 * @swagger
 * tags:
 *   name: Bo'sh ish o'rinlari
 *   description: Vakansiyalar CRUD API
 */

/**
 * @swagger
 * /vacancies:
 *   post:
 *     summary: Yangi vakansiya yaratish
 *     tags: [Bo'sh ish o'rinlari]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - deadline
 *               - salaryType
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: Frontend dasturchi kerak
 *                   ru:
 *                     type: string
 *                     example: Требуется фронтенд разработчик
 *                   oz:
 *                     type: string
 *                     example: Фронтенд дастурчи керак
 *               description:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: React.js, HTML, CSS bilimlariga ega bo‘lishi kerak
 *                   ru:
 *                     type: string
 *                     example: Необходимо знание React.js, HTML, CSS
 *                   oz:
 *                     type: string
 *                     example: React.js, HTML, CSS билимларига эга бўлиши керак
 *               salary:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: 10 000 000 so‘m
 *                   ru:
 *                     type: string
 *                     example: 10 000 000 сум
 *                   oz:
 *                     type: string
 *                     example: 10 000 000 сўм
 *               requirements:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: Kamida 1 yil tajriba talab qilinadi
 *                   ru:
 *                     type: string
 *                     example: Требуется опыт не менее 1 года
 *                   oz:
 *                     type: string
 *                     example: Камида 1 йил тажриба талаб қилинади
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *               salaryType:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     enum: ["To'liq stavka", "Yarim stavka"]
 *                     example: To'liq stavka
 *                   ru:
 *                     type: string
 *                     enum: ["Полная ставка", "Половина ставки"]
 *                     example: Полная ставка
 *                   oz:
 *                     type: string
 *                     enum: ["Тўлиқ ставка", "Ярим ставка"]
 *                     example: Тўлиқ ставка
 *     responses:
 *       201:
 *         description: Vakansiya muvaffaqiyatli yaratildi
 *       400:
 *         description: Majburiy maydonlar to‘ldirilmagan
 *       500:
 *         description: Serverda xatolik
 */
router.post("/", verifyToken, create);


/**
 * @swagger
 * /vacancies:
 *   get:
 *     summary: Barcha vakansiyalarni olish
 *     tags: [Bo'sh ish o'rinlari]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vakansiyalar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vacancies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vacancy'
 *       500:
 *         description: Server xatosi
 */
router.get("/", getAll);

/**
 * @swagger
 * /vacancies/{id}:
 *   get:
 *     summary: ID orqali vakansiyani olish
 *     tags: [Bo'sh ish o'rinlari]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vakansiyaning ObjectID
 *     responses:
 *       200:
 *         description: Vakansiya topildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vacancy:
 *                   $ref: '#/components/schemas/Vacancy'
 *       404:
 *         description: Vakansiya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /vacancies/{id}:
 *   put:
 *     summary: ID orqali vakansiyani yangilash
 *     tags: [Bo'sh ish o'rinlari]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vakansiyaning ObjectID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               description:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               salary:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               requirements:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               deadline: { type: string, format: date }
 *               salaryType:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *     responses:
 *       200:
 *         description: Vakansiya muvaffaqiyatli yangilandi
 *       404:
 *         description: Vakansiya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", verifyToken, update);

/**
 * @swagger
 * /vacancies/{id}:
 *   delete:
 *     summary: ID orqali vakansiyani o‘chirish
 *     tags: [Bo'sh ish o'rinlari]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vakansiyaning ObjectID
 *     responses:
 *       200:
 *         description: Vakansiya muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Vakansiya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
