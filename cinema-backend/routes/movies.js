const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

const validReleaseStatuses = new Set([
  "now_showing",
  "coming_soon",
]);


// GET all movies, optionally filtered by release status
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    if (status && !validReleaseStatuses.has(status)) {
      return res.status(400).json({
        error: "Status must be either now_showing or coming_soon",
      });
    }

    const query = status
      ? "SELECT * FROM movies WHERE release_status = $1 ORDER BY id"
      : "SELECT * FROM movies ORDER BY id";

    const values = status ? [status] : [];

    const { rows } = await pool.query(query, values);

    res.json({
      message: "Movies fetched successfully",
      movies: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

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

// GET showtimes for a movie
router.get("/:slug/showtimes", async (req, res) => {
  try {
    const { slug } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        showtimes.id,
        screens.id AS screen_id,
        screens.name AS screen,

        TO_CHAR(
          showtimes.starts_at AT TIME ZONE 'Australia/Sydney',
          'DD Mon YYYY'
        ) AS show_date,

        TO_CHAR(
          showtimes.starts_at AT TIME ZONE 'Australia/Sydney',
          'HH24:MI'
        ) AS start_time,

        TO_CHAR(
          showtimes.ends_at AT TIME ZONE 'Australia/Sydney',
          'HH24:MI'
        ) AS end_time,

        showtimes.price

      FROM showtimes
      JOIN movies
        ON movies.id = showtimes.movie_id
      JOIN screens
        ON screens.id = showtimes.screen_id

      WHERE LOWER(movies.slug) = LOWER($1)
      ORDER BY showtimes.starts_at
      `,
      [slug]
    );

    res.json({
      showtimes: rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch showtimes",
    });
  }
});

module.exports = router;