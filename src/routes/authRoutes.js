const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { register, login, getAllUsers, deleteUser, makeAdmin, getById, updateUser } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or user already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Foydalanuvchini ID orqali olish
 *     description: Berilgan ID bo‘yicha foydalanuvchi ma’lumotlarini qaytaradi.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID-si (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Foydalanuvchi topildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   example:
 *                     _id: 671f5b2dc05a2b3c8c4f78e9
 *                     name: Sardor Madaliyev
 *                     email: sardor@example.com
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Server xatoligi
 */
router.get("/:id", verifyToken, verifyToken, getById);


/**
 * @swagger
 * /auth/:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: All users fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Yangi Foydalanuvchi"
 *               phone:
 *                 type: string
 *                 example: "998901234567"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Foydalanuvchi muvaffaqiyatli yangilandi!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid input or phone already exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/:id", verifyToken, updateUser);


/**
 * @swagger
 * /auth/make-admin:
 *   post:
 *     summary: Foydalanuvchini admin qilish
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "foydalanuvchi_ismi"
 *     responses:
 *       200:
 *         description: Foydalanuvchi admin qilindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Foydalanuvchi admin qilindi!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Server xatosi
 */
router.post("/make-admin", verifyToken, verifyAdmin, makeAdmin);

/**
 * @swagger
 * /auth/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;
