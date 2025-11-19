const express = require("express");
const router = express.Router();
const multer = require("../middleware/uploadDocument"); // Rasm/video yuklash middleware
const kasabaTadbirlarController = require("../controllers/kasabaTadbirlarController");

/**
 * @swagger
 * tags:
 *   name: Tadbirlar
 *   description: Tadbirlar CRUD operatsiyalari
 */

/**
 * @swagger
 * /tadbirlar/create:
 *   post:
 *     summary: Yangi tadbir yaratish
 *     tags: [Tadbirlar]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 required: true
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *                 required: true
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *                 required: true
 *               time:
 *                 type: string
 *                 required: true
 *               location_uz:
 *                 type: string
 *                 required: true
 *               location_ru:
 *                 type: string
 *               location_oz:
 *                 type: string
 *               category_uz:
 *                 type: string
 *                 enum: ["Форум", "Конференсия", "Ко'ргазма", "Спорт", "Фестивал"]
 *                 required: true
 *               category_ru:
 *                 type: string
 *                 enum: ["Фрум", "Конференция", "Выставка", "Спорт", "Фестиваль"]
 *               category_oz:
 *                 type: string
 *                 enum: ["Forum", "Konferensiya", "Ko'rgazma", "Sport", "Festival"]
 *               users:
 *                 type: number
 *                 required: true
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Rasm yoki video fayl
 *     responses:
 *       201:
 *         description: Tadbir yaratildi
 */
router.post("/create", multer.array("file"), kasabaTadbirlarController.create);

/**
 * @swagger
 * /tadbirlar:
 *   get:
 *     summary: Barcha tadbirlarni olish
 *     tags: [Tadbirlar]
 *     responses:
 *       200:
 *         description: Tadbirlar ro‘yxati
 */
router.get("/", kasabaTadbirlarController.getAll);

/**
 * @swagger
 * /tadbirlar/{id}:
 *   put:
 *     summary: Tadbirni yangilash
 *     tags: [Tadbirlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               description_uz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               location_uz:
 *                 type: string
 *               location_ru:
 *                 type: string
 *               location_oz:
 *                 type: string
 *               category_uz:
 *                 type: string
 *                 enum: ["Форум", "Конференсия", "Ко'ргазма", "Спорт", "Фестивал"]
 *               category_ru:
 *                 type: string
 *                 enum: ["Фрум", "Конференция", "Выставка", "Спорт", "Фестиваль"]
 *               category_oz:
 *                 type: string
 *                 enum: ["Forum", "Konferensiya", "Ko'rgazma", "Sport", "Festival"]
 *               users:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Rasm yoki video fayl (ixtiyoriy)
 *     responses:
 *       200:
 *         description: Tadbir yangilandi
 */
router.put("/:id", multer.array("file"), kasabaTadbirlarController.update);

/**
 * @swagger
 * /tadbirlar/{id}:
 *   delete:
 *     summary: Tadbirni o‘chirish
 *     tags: [Tadbirlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tadbir o‘chirildi
 */
router.delete("/:id", kasabaTadbirlarController.remove);

module.exports = router;
