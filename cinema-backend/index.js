require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");

const moviesRoutes = require("./routes/movies");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Cinema Ticket Booking System API" });
});

app.get("/data", (req, res) => {
  res.json({ message: pool ? "Database connection pool is available" : "Database connection pool is not available" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ ADD THIS
app.use("/api/movies", moviesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});