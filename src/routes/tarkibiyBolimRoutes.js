const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/tarkibiyBolimController");
const { verifyToken } = require("../middleware/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Bolimlar
 *   description: Tarkibiy bo‘limlar (3 tilda)
 */

/**
 * @swagger
 * /bolimlar:
 *   post:
 *     summary: Yangi bo‘lim yaratish (uz, ru, oz)
 *     tags: [Bolimlar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: "IT bo‘limi"
 *               title_ru:
 *                 type: string
 *                 example: "IT отдел"
 *               title_oz:
 *                 type: string
 *                 example: "IT bo‘limi (lotin)"
 *               employees_uz:
 *                 type: string
 *                 example: "5 ta xodim"
 *               employees_ru:
 *                 type: string
 *                 example: "5 сотрудников"
 *               employees_oz:
 *                 type: string
 *                 example: "5 ta xodim (lotin)"
 *               leader_uz:
 *                 type: string
 *                 example: "Sardor"
 *               leader_ru:
 *                 type: string
 *                 example: "Сардор"
 *               leader_oz:
 *                 type: string
 *                 example: "Sardor (lotin)"
 *               desc_uz:
 *                 type: string
 *                 example: "Bo‘lim IT xizmatlarini bajaradi"
 *               desc_ru:
 *                 type: string
 *                 example: "Отдел выполняет IT услуги"
 *               desc_oz:
 *                 type: string
 *                 example: "Bo‘lim IT xizmatlarini bajaradi (lotin)"
 *     responses:
 *       201:
 *         description: Bo‘lim yaratildi
 *       400:
 *         description: Majburiy maydon to‘ldirilmagan
 */
router.post("/", verifyToken, create);

/**
 * @swagger
 * /bolimlar:
 *   get:
 *     summary: Barcha bo‘limlarni olish
 *     tags: [Bolimlar]
 *     responses:
 *       200:
 *         description: Barcha bo‘limlar ro‘yxati
 */
router.get("/", getAll);

/**
 * @swagger
 * /bolimlar/{id}:
 *   get:
 *     summary: ID orqali bitta bo‘limni olish
 *     tags: [Bolimlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bo‘lim ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bo‘lim topildi
 *       404:
 *         description: Bo‘lim topilmadi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /bolimlar/{id}:
 *   put:
 *     summary: Bo‘limni yangilash
 *     tags: [Bolimlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanishi kerak bo‘lgan bo‘lim ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               employees_uz:
 *                 type: string
 *               employees_ru:
 *                 type: string
 *               employees_oz:
 *                 type: string
 *               leader_uz:
 *                 type: string
 *               leader_ru:
 *                 type: string
 *               leader_oz:
 *                 type: string
 *               desc_uz:
 *                 type: string
 *               desc_ru:
 *                 type: string
 *               desc_oz:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bo‘lim yangilandi
 *       404:
 *         description: Bo‘lim topilmadi
 */
router.put("/:id", verifyToken, update);

/**
 * @swagger
 * /bolimlar/{id}:
 *   delete:
 *     summary: Bo‘limni o‘chirish
 *     tags: [Bolimlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan bo‘lim ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bo‘lim muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Bo‘lim topilmadi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;
