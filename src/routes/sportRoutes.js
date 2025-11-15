const router = require("express").Router();
const sport = require("../controllers/sportController");

/**
 * @swagger
 * tags:
 *   name: Sport
 *   description: NefteGaz Sport tizimi API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sport:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title:
 *           type: object
 *           properties:
 *             uz: { type: string }
 *             oz: { type: string }
 *             ru: { type: string }
 *         place:
 *           type: object
 *           properties:
 *             uz: { type: string }
 *             oz: { type: string }
 *             ru: { type: string }
 *         description:
 *           type: object
 *           properties:
 *             uz: { type: string }
 *             oz: { type: string }
 *             ru: { type: string }
 *         athlete:
 *           type: object
 *           properties:
 *             uz: { type: string }
 *             oz: { type: string }
 *             ru: { type: string }
 *         createdAt: { type: string }
 *         updatedAt: { type: string }
 */

/**
 * @swagger
 * /sport:
 *   post:
 *     summary: Sport ma'lumotini yaratish
 *     tags: [Sport]
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
 *     responses:
 *       201: { description: Yaratildi }
 *       400: { description: Majburiy maydonlar yo‘q }
 */
router.post("/", sport.create);


/**
 * @swagger
 * /sport:
 *   get:
 *     summary: Barcha sport ma'lumotlari
 *     tags: [Sport]
 *     responses:
 *       200:
 *         description: Barcha ma'lumotlar ro'yxati
 */
router.get("/", sport.getAll);


/**
 * @swagger
 * /sport/{id}:
 *   put:
 *     summary: Sport ma'lumotini yangilash
 *     tags: [Sport]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *         description: Ma'lumot ID si
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200: { description: Yangilandi }
 *       404: { description: Topilmadi }
 */
router.put("/:id", sport.update);


/**
 * @swagger
 * /sport/{id}:
 *   delete:
 *     summary: Sport ma'lumotini o‘chirish
 *     tags: [Sport]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *         description: Ma'lumot ID si
 *     responses:
 *       200: { description: O‘chirildi }
 *       404: { description: Topilmadi }
 */
router.delete("/:id", sport.remove);

module.exports = router;
