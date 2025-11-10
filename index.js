const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Routes
const authRoutes = require("./src/routes/authRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const leaderRoutes = require("./src/routes/leaderRoutes");
const vacancyRoutes = require("./src/routes/vacancyRoutes");
const normativRoutes = require("./src/routes/normativeRoutes");
const honoraryRoutes = require("./src/routes/honoraryRoutes");
const tarkibiyBolimRoutes = require("./src/routes/tarkibiyBolimRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
const localNewsRoutes = require("./src/routes/localNewsRoutes");
const industryNewsRoutes = require("./src/routes/industryNewsRoutes");
const plansReportsRoutes = require("./src/routes/plansReportsRoutes");
const xotinQizlarRoutes = require("./src/routes/xotinQizlarRoutes");
const yoshlarSiyosatiRoutes = require("./src/routes/yoshlarSiyosatiRoutes");
const genderRoutes = require("./src/routes/genderRoutes");
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger");

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
// DB
connectDB();

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",             // local development uchun
    "http://localhost:5174",             // local development uchun
    "https://admin.ngbi.uz",
    "https://www.ngbi.uz",       // production frontend domeningiz
    "https://ngbi.uz"          // production frontend domeningiz
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // agar cookie yoki JWT token yuborilsa, kerak bo‘ladi
}));

app.use(express.json());


// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/leader", leaderRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/normative", normativRoutes);
app.use("/api/honorary", honoraryRoutes);
app.use("/api/bolimlar", tarkibiyBolimRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/localNews", localNewsRoutes);
app.use("/api/industryNews", industryNewsRoutes);
app.use("/api/plansReports", plansReportsRoutes);
app.use("/api/xotinQizlar", xotinQizlarRoutes)
app.use("/api/yoshlarSiyosati", yoshlarSiyosatiRoutes);
app.use("/api/gender", genderRoutes)
// Statik fayllar
// Statik fayllar
app.use("/uploads/banners", express.static(path.join(__dirname, "src", "uploads", "banners")));
app.use("/uploads/files", express.static(path.join(__dirname, "src", "uploads", "files")));
app.use("/uploads/news", express.static(path.join(__dirname, "src", "uploads", "news")));
app.use("/uploads/honorary", express.static(path.join(__dirname, "src", "uploads", "honorary")));
app.use("/uploads/localNews", express.static(path.join(__dirname, "src", "uploads", "localNews")));
app.use("/uploads/industryNews", express.static(path.join(__dirname, "src", "uploads", "industryNews")));
app.use("/uploads/leaders", express.static(path.join(__dirname, "src", "uploads", "leaders")))
app.use("/uploads/xotinQizlar", express.static(path.join(__dirname, "src", "uploads", "xotinQizlar")))
app.use("/uploads/yoshlarSiyosati", express.static(path.join(__dirname, "src", "uploads", "yoshlarSiyosati")))
app.use("/uploads/gender", express.static(path.join(__dirname, "src", "uploads", "gender")))
app.use("/assets", express.static(path.join(__dirname, "src/assets/images")));


// Root
app.get("/", (req, res) => {
  res.send("✅ Uzbekneftegaz Backend ishlayapti 🚀");
});

// Port
app.listen(PORT,  "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});
