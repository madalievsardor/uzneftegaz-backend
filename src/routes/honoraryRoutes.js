const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware")
const upload = require("../middleware/upload"); // Sizning upload.js
const honoraryController = require("../controllers/hononaryController");

/**
 * @swagger
 * tags:
 *   name: Faxriy hodimlar
 *   description: Faxriy xodimlar CRUD
 */

/**
 * @swagger
 * /honorary/create:
 *   post:
 *     summary: Yangi faxriy xodim yaratish
 *     tags: [Faxriy hodimlar]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName_uz
 *               - specialist_uz
 *               - grade_uz
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Faxriy xodim rasmi
 *               fullName_uz:
 *                 type: string
 *                 example: "Иванов Иван"
 *               fullName_ru:
 *                 type: string
 *                 example: "Иванов Иван"
 *               fullName_oz:
 *                 type: string
 *                 example: "Ivanov Ivan"
 *               specialist_uz:
 *                 type: string
 *                 example: "Muhandis"
 *               specialist_ru:
 *                 type: string
 *                 example: "Инженер"
 *               specialist_oz:
 *                 type: string
 *                 example: "Engineer"
 *               experience_uz:
 *                 type: string
 *                 example: "5 yil"
 *               experience_ru:
 *                 type: string
 *                 example: "5 лет"
 *               experience_oz:
 *                 type: string
 *                 example: "5 years"
 *               project_uz:
 *                 type: string
 *               project_ru:
 *                 type: string
 *               project_oz:
 *                 type: string
 *               grade_uz:
 *                 type: string
 *                 example: "A"
 *               grade_ru:
 *                 type: string
 *                 example: "A"
 *               grade_oz:
 *                 type: string
 *                 example: "A"
 *               description_uz:
 *                 type: string
 *                 example: "Tavsif (UZ)"
 *               description_ru:
 *                 type: string
 *                 example: "Описание (RU)"
 *               description_oz:
 *                 type: string
 *                 example: "Description (OZ)"
 *     responses:
 *       201:
 *         description: Faxriy xodim yaratildi
 *       400:
 *         description: Noto‘g‘ri ma’lumot
 *       500:
 *         description: Server xatolik
 */
router.post(
  "/create", verifyToken, (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if(err) {
        return res.status(400).json({message: err.message})
      }
      next()
    })
  },
  honoraryController.create
);

/**
 * @swagger
 * /honorary/:
 *   get:
 *     summary: Barcha faxriy xodimlarni olish
 *     tags: [Faxriy hodimlar]
 *     responses:
 *       200:
 *         description: Barcha xodimlar
 *       500:
 *         description: Server xatolik
 */
router.get("/", honoraryController.getAll);

/**
 * @swagger
 * /honorary/{id}:
 *   get:
 *     summary: ID orqali faxriy xodimni olish
 *     tags: [Faxriy hodimlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Xodim ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xodim topildi
 *       404:
 *         description: Xodim topilmadi
 *       500:
 *         description: Server xatolik
 */
router.get("/:id",  honoraryController.getById);

/**
 * @swagger
 * /honorary/update/{id}:
 *   put:
 *     summary: Faxriy xodimni yangilash
 *     tags: [Faxriy hodimlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Xodim ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               fullName_uz:
 *                 type: string
 *               fullName_ru:
 *                 type: string
 *               fullName_oz:
 *                 type: string
 *               specialist_uz:
 *                 type: string
 *               specialist_ru:
 *                 type: string
 *               specialist_oz:
 *                 type: string
 *               experience_uz:
 *                 type: string
 *               experience_ru:
 *                 type: string
 *               experience_oz:
 *                 type: string
 *               project_uz:
 *                 type: string
 *               project_ru:
 *                 type: string
 *               project_oz:
 *                 type: string
 *               grade_uz:
 *                 type: string
 *               grade_ru:
 *                 type: string
 *               grade_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xodim yangilandi
 *       404:
 *         description: Xodim topilmadi
 *       500:
 *         description: Server xatolik
 */
router.put(
  "/update/:id", verifyToken, (req, res, next) => {
    upload.single("image") (req, res, (err) => {
      if(err) {
        return res.status(400).json({message: err.message})
      }
      next()
    })
  },
  honoraryController.updateById
);

/**
 * @swagger
 * /honorary/delete/{id}:
 *   delete:
 *     summary: Faxriy xodimni o‘chirish
 *     tags: [Faxriy hodimlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Xodim ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xodim o‘chirildi
 *       404:
 *         description: Xodim topilmadi
 *       500:
 *         description: Server xatolik
 */
router.delete("/delete/:id", verifyToken, honoraryController.deleteById);

module.exports = router;
