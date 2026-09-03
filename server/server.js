require("dotenv").config();
require("express-async-errors"); // lets async controller errors reach the error handler below

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const connectDB = require("./config/db");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const tokenRoutes = require("./routes/tokenRoutes");

const app = express();

connectDB();

app.use(helmet({ crossOriginResourcePolicy: false }));
// In production, set CLIENT_URL to your deployed frontend's origin
// (e.g. https://mediflow.vercel.app) to restrict CORS. Left unset,
// this allows all origins, which is fine for local dev only.
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ success: true, message: "MediFlow AI server is running" }));

app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/tokens", tokenRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server] MediFlow AI running on port ${PORT}`));
