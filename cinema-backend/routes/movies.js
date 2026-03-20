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

// GET movie by ID
/* router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({
      message: "Movie fetched successfully",
      movie: rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
}); */

// GET movie by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const { rows } = await pool.query(
      "SELECT * FROM movies WHERE slug = $1",
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({
      message: "Movie fetched successfully",
      movie: rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

module.exports = router;