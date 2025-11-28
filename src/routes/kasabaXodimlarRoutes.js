const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const kasaba = require("../controllers/kasabaXodimlarController");
const { verifyToken } = require("../middleware/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Kasaba Xodimlari
 *   description: Kasaba xodimlari CRUD API
 */

/**
 * @swagger
 * /kasabaXodimlar/create:
 *   post:
 *     summary: Yangi xodim qo‘shish
 *     tags: [Kasaba Xodimlari]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz: { type: string }
 *               title_ru: { type: string }
 *               title_oz: { type: string }
 *               description_uz: { type: string }
 *               description_ru: { type: string }
 *               description_oz: { type: string }
 *               category_uz: { type: string }
 *               category_ru: { type: string }
 *               category_oz: { type: string }
 *               gifts_uz: { type: string }
 *               gifts_ru: { type: string }
 *               gifts_oz: { type: string }
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Ma’lumot qo‘shildi
 */
router.post(
    "/create",
    verifyToken,
    (req, res, next) => {
        upload.array("media", 10)(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message });
            next();
        });
    },
    kasaba.create
);


/**
 * @swagger
 * /kasabaXodimlar:
 *   get:
 *     summary: Barcha xodimlarni olish
 *     tags: [Kasaba Xodimlari]
 *     responses:
 *       200:
 *         description: Ro‘yxat qaytarildi
 */
router.get("/", kasaba.getAll);


/**
 * @swagger
 * /kasabaXodimlar/{id}:
 *   put:
 *     summary: Xodimni yangilash
 *     tags: [Kasaba Xodimlari]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
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
 *               title_uz: { type: string }
 *               title_ru: { type: string }
 *               title_oz: { type: string }
 *               description_uz: { type: string }
 *               description_ru: { type: string }
 *               description_oz: { type: string }
 *               category_uz: { type: string }
 *               category_ru: { type: string }
 *               category_oz: { type: string }
 *               gifts_uz: { type: string }
 *               gifts_ru: { type: string }
 *               gifts_oz: { type: string }
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Yangilandi
 */
router.put(
    "/:id",
    verifyToken,
    (req, res, next) => {
        upload.array("media", 10)(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message });
            next();
        });
    },
    kasaba.update
);

/**
 * @swagger
 * /kasabaXodimlar/clear-all-gifts:
 *   delete:
 *     summary: Barcha xodimlardagi giftslarni o‘chirish
 *     tags: [Kasaba Xodimlari]
 *     responses:
 *       200:
 *         description: Barcha giftslar o'chirildi
 */
router.delete("/clear-all-gifts", verifyToken, kasaba.clearAllGifts);

/**
 * @swagger
 * /kasabaXodimlar/{id}:
 *   delete:
 *     summary: Xodimni o‘chirish
 *     tags: [Kasaba Xodimlari]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: O‘chirildi
 */
router.delete("/:id", kasaba.remove);

module.exports = router;
