const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const uploadBooks = require("../middleware/uploadBooks"); // rasm/video

// ================= CREATE =================
/**
 * @swagger
 * /books/create:
 *   post:
 *     summary: Yangi kitob qo'shish
 *     tags: [Kitoblar]
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
 *               avtor_uz: { type: string }
 *               avtor_ru: { type: string }
 *               avtor_oz: { type: string }
 *               description_uz: { type: string }
 *               description_ru: { type: string }
 *               description_oz: { type: string }
 *               pages: { type: number }
 *               year: { type: number }
 *               mediaImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               mediaDocs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Kitob muvaffaqiyatli yaratildi
 */
router.post("/create", (req, res, next) => {
  uploadBooks(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });

    req.filesImage = req.files?.mediaImages || [];
    req.filesDocument = req.files?.mediaDocs || [];
    next();
  });
}, booksController.create);


// ================= GET ALL =================
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Barcha kitoblarni olish
 *     tags: [Kitoblar]
 *     responses:
 *       200:
 *         description: Kitoblar ro'yxati
 */
router.get("/", booksController.getAll);

// ================= UPDATE =================
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Kitobni yangilash
 *     tags: [Kitoblar]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Kitob ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz: { type: string }
 *               title_ru: { type: string }
 *               title_oz: { type: string }
 *               avtor_uz: { type: string }
 *               avtor_ru: { type: string }
 *               avtor_oz: { type: string }
 *               description_uz: { type: string }
 *               description_ru: { type: string }
 *               description_oz: { type: string }
 *               pages: { type: number }
 *               year: { type: number }
 *               mediaImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               mediaDocs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Kitob muvaffaqiyatli yangilandi
 */
router.put("/:id", (req, res, next) => {
    uploadBooks(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });

        // Controllerga moslab fayllarni beramiz
        req.filesImage = req.files?.mediaImages || [];
        req.filesDocument = req.files?.mediaDocs || [];
        next();
    });
}, booksController.update);

// ================= DELETE =================
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Kitobni o'chirish
 *     tags: [Kitoblar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Kitob ID
 *     responses:
 *       200:
 *         description: Kitob muvaffaqiyatli o'chirildi
 */
router.delete("/:id", booksController.remove);

module.exports = router;
