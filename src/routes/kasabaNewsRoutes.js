const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // multer (images/videos)
const kasabaNewsController = require("../controllers/kasabaNewsController");
const { verifyToken } = require("../middleware/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Kasaba News
 *   description: Kasaba yangiliklari bo‘yicha CRUD amallar
 */

/**
 * @swagger
 * /kasabaNews/create:
 *   post:
 *     summary: Yangi yangilik yaratish (rasm yoki video bilan)
 *     tags: [Kasaba News]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Rasm yoki video fayllar (bir nechta yuklash mumkin)
 *               title_uz:
 *                 type: string
 *                 example: Yangilik nomi uz
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               desc_uz:
 *                 type: string
 *                 example: Yangilik matni uz
 *               desc_ru:
 *                 type: string
 *               desc_oz:
 *                 type: string
 *     responses:
 *       201:
 *         description: Yangilik yaratildi
 */
router.post("/create", verifyToken, (req, res, next) => {
    upload.array("files", 10) (req, res, (err) => {
        if(err) {
            return res.status(400).json({message: err.message})
        }
        next();
    });
},
 kasabaNewsController.create
)


/**
 * @swagger
 * /kasabaNews:
 *   get:
 *     summary: Barcha yangiliklarni olish
 *     tags: [Kasaba News]
 *     responses:
 *       200:
 *         description: Yangiliklar ro‘yxati
 */
router.get("/", kasabaNewsController.getAll);



/**
 * @swagger
 * /kasabaNews/{id}:
 *   put:
 *     summary: Yangilikni yangilash (rasm/video almashtirish ixtiyoriy)
 *     tags: [Kasaba News]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Yangi rasm/video fayllar (ixtiyoriy)
 *               title_uz:
 *                 type: string
 *               title_ru:
 *                 type: string
 *               title_oz:
 *                 type: string
 *               desc_uz:
 *                 type: string
 *               desc_ru:
 *                 type: string
 *               desc_oz:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yangilandi
 */
router.put("/:id", verifyToken, (req, res, next) => {
    upload.array("files", 10) (req, res, (err) => {
        if(err) {
            return res.status(400).json({message: err.message});
        };
        next()
    });
}, kasabaNewsController.update)


/**
 * @swagger
 * /kasabaNews/{id}:
 *   delete:
 *     summary: Yangilikni o‘chirish
 *     tags: [Kasaba News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yangilik o‘chirildi
 */
router.delete("/:id", verifyToken, kasabaNewsController.remove);

module.exports = router;
