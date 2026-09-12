require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const pool = require("./db/pool");

const moviesRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");

const app = express();

// Allow the React frontend to send authentication cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies sent by the browser
app.use(cookieParser());

// General routes
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to the Cinema Ticket Booking System API",
  });
});

app.get("/data", (req, res) => {
  res.json({
    message: pool
      ? "Database connection pool is available"
      : "Database connection pool is not available",
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
  });
});

// API routes
app.use("/movies", moviesRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});