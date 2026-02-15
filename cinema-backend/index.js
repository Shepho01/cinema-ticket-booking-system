require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } =  require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Database test route ← NEW
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
