const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = "7d"
exports.register = async (req, res) => {
    try {
        const { username, password, phone } = req.body;

        if (!username || !password || !phone) {
            return res.status(400).json({ message: "Barcha maydonlarni to‘ldirish shart!" })
        }

        const existisingUser = await userModel.findOne({ phone });
        if (existisingUser) {
            return res.status(400).json({ message: "Bu raqam allaqachon ro‘yxatdan o‘tgan!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            username,
            password: hashedPassword,
            phone,
            
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, phone: newUser.phone }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN }
        );

        res.status(201).json({
            message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tkazildi!",
            user: {
                id: newUser._id,
                username: newUser.username,
                phone: newUser.phone,
            },
            token,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server xatosi!", error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: "Barcha maydonlarni to‘ldirish shart!" });
        }

        const user = await userModel.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: "Bunday foydalanuvchi topilmadi!" });
        }

        // 🔒 Agar foydalanuvchi bloklangan bo‘lsa, vaqtini tekshiramiz
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remaining = Math.ceil((user.lockUntil - Date.now()) / 1000); // soniya
            return res.status(403).json({
                message: `Akkount vaqtincha bloklangan! Qolgan vaqt: ${remaining} soniya.`
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.loginAttempts += 1;

            // ❗ 5 marta noto‘g‘ri kirsa — 15 soniyaga bloklash
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 1000; // 15 soniya
                user.loginAttempts = 0; // reset attempts
            }

            await user.save();
            return res.status(400).json({
                message: "Parol noto‘g‘ri! Ehtiyot bo‘ling, 5 marta noto‘g‘ri kirishda 15 soniyaga bloklanasiz."
            });
        }

        // ✅ Parol to‘g‘ri bo‘lsa — urinishlarni nolga tushiramiz
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Tizimga muvaffaqiyatli kirdingiz!",
            user: {
                id: user._id,
                username: user.username,
                phone: user.phone,
                role: user.role
            },
            token,
        });
    } catch (e) {
        console.log("Server xatosi", e);
        res.status(500).json({ message: "Server xatosi!", error: e.message });
    }
};



exports.getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find();
        res.status(200).json({message: "Barcha foydalanuvchilar ro‘yxati", users})
    } catch(e) {
         res.status(500).json({message: "Server xatosi!"})
    }
}

exports.getById = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: "Foydalanuvchi topilmadi."});
        }
        res.status(200).json({user})
    }catch(e) {
        res.status(500).json({message: "Serverda xatolik", error: e.message})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
        }

        res.status(200).json({ message: "Foydalanuvchi muvaffaqiyatli o‘chirildi!" });
    } catch (err) {
        res.status(500).json({ message: "Server xatosi!", error: err.message });
    }
};

exports.makeAdmin = async (req, res) => {
  try {
    const { username } = req.body; // Foydalanuvchi username ni body dan olamiz
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: `${username} admin qilindi`, user });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phone, password } = req.body;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
        }

        if (username) user.username = username;
        if (phone) user.phone = phone;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({
            message: "Foydalanuvchi muvaffaqiyatli yangilandi!",
            user: {
                id: user._id,
                username: user.username,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server xatosi!", error: err.message });
    }
};