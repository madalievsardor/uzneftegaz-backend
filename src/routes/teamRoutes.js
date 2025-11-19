const router = require("express").Router();
const team = require("../controllers/teamController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // Agar rasm yuklash middleware bo‘lsa

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: NefteGaz jamoa (xodimlar) API
 */


/**
 * @swagger
 * /team:
 *   post:
 *     summary: Xodim ma'lumotini yaratish
 *     tags: [Team]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name_uz
 *               - grade_uz
 *               - phone
 *               - avatar
 *             properties:
 *               name_uz: { type: string }
 *               name_ru: { type: string }
 *               name_oz: { type: string }
 *               grade_uz: { type: string }
 *               grade_ru: { type: string }
 *               grade_oz: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Ma'lumot yaratildi }
 *       400: { description: Xato yoki majburiy maydon kiritilmagan }
 */
// router.post("/", upload.single("avatar"), team.create);
router.post("/", verifyToken, (req, res, next) => {
    upload.single("avatar") (req, res, (err) => {
        if(err) {
            return res.status(400).json({message: err.message})
        }
        next()
    })
}, team.create)


//
// 🟡 GET ALL
//
/**
 * @swagger
 * /team:
 *   get:
 *     summary: Barcha xodimlar ro'yxati
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: Xodimlar ro'yxati
 */
router.get("/", team.getAll);


//
// 🔵 UPDATE
//
/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Xodim ma'lumotini yangilash
 *     tags: [Team]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Xodim ID si
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
 *               name_uz: { type: string }
 *               name_ru: { type: string }
 *               name_oz: { type: string }
 *               grade_uz: { type: string }
 *               grade_ru: { type: string }
 *               grade_oz: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200: { description: Ma'lumot yangilandi }
 *       404: { description: Xodim topilmadi }
 */
// router.put("/:id", upload.single("avatar"), team.update);
router.put("/:id", verifyToken, (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
        if(err) {
            return res.status(400).json({message: err.message})
        }
        next();
    });
}, team.update)

//
// 🔴 DELETE
//
/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Xodimni o'chirish
 *     tags: [Team]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Xodim ID si
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: O'chirildi }
 *       404: { description: Topilmadi }
 */
router.delete("/:id", verifyToken, team.remove);

module.exports = router;
