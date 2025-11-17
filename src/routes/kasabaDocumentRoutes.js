const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadDocument");
const kasabaController = require("../controllers/kasabaController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Kasaba Documents
 *   description: Kasaba hujjatlari bo‘yicha CRUD amallar
 */


/**
 * @swagger
 * /kasabaDocuments/create:
 *   post:
 *     summary: Yangi kasaba hujjatini yaratish
 *     tags: [Kasaba Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Rasm yuklash
 *               title_uz:
 *                 type: string
 *                 example: Sarlovha uz
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               decree_uz:
 *                 type: string
 *                 example: Farmon uz
 *               decree_ru:
 *                 type: string
 *               decree_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *                 example: Tavsif uz
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hujjat yaratildi
 */
router.post("/create", verifyToken, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        next()
    })
}, kasabaController.create);



/**
 * @swagger
 * /kasabaDocuments:
 *   get:
 *     summary: Barcha kasaba hujjatlarini olish
 *     tags: [Kasaba Documents]
 *     responses:
 *       200:
 *         description: Hujjatlar ro‘yxati
 */
router.get("/", kasabaController.getAll);




/**
 * @swagger
 * /kasabaDocuments/update/{id}:
 *   put:
 *     summary: Hujjatni yangilash
 *     tags: [Kasaba Documents]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Yangi rasm yuklash (ixtiyoriy)
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               decree_uz:
 *                 type: string
 *               decree_ru:
 *                 type: string
 *               decree_oz:
 *                 type: string
 *               description_uz:
 *                 type: string
 *               description_ru:
 *                 type: string
 *               description_oz:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yangilandi
 */
router.put("/update/:id", verifyToken, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }
        next()
    })
}, kasabaController.update);



/**
 * @swagger
 * /kasabaDocuments/delete/{id}:
 *   delete:
 *     summary: Hujjatni o‘chirish
 *     tags: [Kasaba Documents]
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
router.delete("/delete/:id", kasabaController.remove);

module.exports = router;
