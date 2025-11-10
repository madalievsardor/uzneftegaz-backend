const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "No token provided"})
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch(e) {
        return res.status(403).json({message: "Invalid or expired token"})
    }
}

// 🧩 Tokenni tekshirish
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // token ichidagi user ma’lumotlari (id, role va boshqalar)
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 🔒 Faqat admin kirishi mumkin bo‘lganlar uchun
exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
