const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadDocument"); // multer fayl yuklash middleware
const normativeDocumentController = require("../controllers/normativeController");

/**
 * @swagger
 * tags:
 *   name: Me'yoriy hujjatlar
 *   description: 🧾 Normativ hujjatlar uchun CRUD API
 */

/**
 * @swagger
 * /normative/create:
 *   post:
 *     summary: Yangi normativ hujjat yaratish
 *     tags: [Me'yoriy hujjatlar]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title_uz
 *               - decree_uz
 *               - description_uz
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Yuklanadigan PDF, DOC yoki ZIP fayl
 *               # -----------------------------
 *               # 🏷️ Sarlavha (title)
 *               # -----------------------------
 *               title_uz:
 *                 type: string
 *                 description: Hujjat nomi (O‘zbekcha)
 *                 example: "Qaror to‘g‘risida"
 *               title_ru:
 *                 type: string
 *                 description: Hujjat nomi (Ruscha)
 *                 example: "О постановлении"
 *               title_oz:
 *                 type: string
 *                 description: Hujjat nomi (Lotincha)
 *                 example: "Qaror haqida"
 *               # -----------------------------
 *               # 📜 Qaror raqami (decree)
 *               # -----------------------------
 *               decree_uz:
 *                 type: string
 *                 description: Qaror yoki farmon raqami (O‘zbekcha)
 *                 example: "123-sonli qaror"
 *               decree_ru:
 *                 type: string
 *                 description: Qaror yoki farmon raqami (Ruscha)
 *                 example: "Постановление №123"
 *               decree_oz:
 *                 type: string
 *                 description: Qaror yoki farmon raqami (Lotincha)
 *                 example: "123-son qaror"
 *               # -----------------------------
 *               # 🧾 Tavsif (description)
 *               # -----------------------------
 *               description_uz:
 *                 type: string
 *                 description: Tavsif (O‘zbekcha)
 *                 example: "Ushbu qaror moliya sohasiga taalluqlidir."
 *               description_ru:
 *                 type: string
 *                 description: Tavsif (Ruscha)
 *                 example: "Это постановление связано с финансовым сектором."
 *               description_oz:
 *                 type: string
 *                 description: Tavsif (Lotincha)
 *                 example: "Bu qaror moliya sohasi haqida."
 *     responses:
 *       201:
 *         description: Hujjat muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto‘g‘ri maʼlumot kiritilgan
 *       500:
 *         description: Serverda xatolik
 */
router.post("/create", verifyToken, (req, res, next) => {
  upload.single("file") (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, normativeDocumentController.create);


/**
 * @swagger
 * /normative/all:
 *   get:
 *     summary: Barcha normativ hujjatlarni olish
 *     tags: [Me'yoriy hujjatlar]
 *     responses:
 *       200:
 *         description: Hamma hujjatlar ro‘yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/all", normativeDocumentController.getAll);

/**
 * @swagger
 * /normative/{id}:
 *   get:
 *     summary: ID orqali bitta normativ hujjatni olish
 *     tags: [Me'yoriy hujjatlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Hujjat ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hujjat maʼlumotlari
 *       404:
 *         description: Hujjat topilmadi
 */
router.get("/:id", normativeDocumentController.getById);

/**
 * @swagger
 * /normative/update/{id}:
 *   put:
 *     summary: Normativ hujjatni yangilash (uz, oz, ru tillarda)
 *     tags: [Me'yoriy hujjatlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Hujjatning ID si
 *         schema:
 *           type: string
 *           example: 6726a1f87c3bfa06c8f4d999
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: "O‘zbekiston Respublikasi Qonuni"
 *               title_oz:
 *                 type: string
 *                 example: "Ўзбекистон Республикаси Қонуни"
 *               title_ru:
 *                 type: string
 *                 example: "Закон Республики Узбекистан"
 *               decree_uz:
 *                 type: string
 *                 example: "Prezident qarori №123"
 *               decree_oz:
 *                 type: string
 *                 example: "Президент қарори №123"
 *               decree_ru:
 *                 type: string
 *                 example: "Постановление Президента №123"
 *               description_uz:
 *                 type: string
 *                 example: "Bu hujjat yangi me'yoriy tartibni belgilaydi."
 *               description_oz:
 *                 type: string
 *                 example: "Бу ҳужжат янги меъёрий тартибни белгилайди."
 *               description_ru:
 *                 type: string
 *                 example: "Этот документ определяет новый нормативный порядок."
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Yangi fayl (agar yuklansa)
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto‘g‘ri ID yoki ma'lumotlar
 *       404:
 *         description: Hujjat topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put(
  "/update/:id", verifyToken, (req, res, next) => {
  upload.single("file") (req, res, (err) => {
    if(err) {
      return res.status(400).json({message: err.message})
    }
    next()
  })
}, normativeDocumentController.create);

/**
 * @swagger
 * /normative/delete/{id}:
 *   delete:
 *     summary: Hujjatni o‘chirish
 *     tags: [Me'yoriy hujjatlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan hujjat ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Hujjat topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/delete/:id", verifyToken, normativeDocumentController.remove);

module.exports = router;
