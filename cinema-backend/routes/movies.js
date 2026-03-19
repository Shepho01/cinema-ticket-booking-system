const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET all movies
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM movies");
    res.json({ message: "Movies fetched successfully", movies: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// GET single movie by slug (movie_name param)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Adjust this query to match your table columns:
    // If you have a "slug" column, use WHERE slug = $1
    // If not, temporarily use WHERE name = $1 (not ideal long-term)
    const { rows } = await pool.query(
      "SELECT * FROM movies WHERE slug = $1 LIMIT 1",
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ movie: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

module.exports = router;