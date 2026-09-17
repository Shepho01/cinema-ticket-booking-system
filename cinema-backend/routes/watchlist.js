const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();


// ADD MOVIE TO WATCHLIST
router.post("/:movieId", requireAuth, async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        error: "Invalid movie ID",
      });
    }

    const movieResult = await pool.query(
      `
      SELECT id
      FROM movies
      WHERE id = $1
      `,
      [movieId]
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({
        error: "Movie not found",
      });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO watchlist (
        member_id,
        movie_id
      )
      VALUES ($1, $2)

      RETURNING
        id,
        member_id AS "memberId",
        movie_id AS "movieId",
        created_at AS "createdAt"
      `,
      [
        req.memberId,
        movieId,
      ]
    );

    res.status(201).json({
      message: "Movie added to watchlist",
      watchlistItem: rows[0],
    });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Movie is already in your watchlist",
      });
    }

    console.error(
      "Failed to add movie to watchlist:",
      err
    );

    res.status(500).json({
      error: "Failed to add movie to watchlist",
    });
  }
});


// REMOVE MOVIE FROM WATCHLIST
router.delete("/:movieId", requireAuth, async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        error: "Invalid movie ID",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM watchlist
      WHERE member_id = $1
        AND movie_id = $2
      RETURNING id
      `,
      [
        req.memberId,
        movieId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Movie is not in your watchlist",
      });
    }

    res.json({
      message: "Movie removed from watchlist",
    });

  } catch (err) {
    console.error(
      "Failed to remove movie from watchlist:",
      err
    );

    res.status(500).json({
      error: "Failed to remove movie from watchlist",
    });
  }
});


// GET LOGGED-IN MEMBER'S WATCHLIST
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        w.id AS "watchlistId",
        w.created_at AS "createdAt",

        m.id AS "movieId",
        m.name,
        m.slug,
        m.classification,
        m.overview

      FROM watchlist w

      JOIN movies m
        ON m.id = w.movie_id

      WHERE w.member_id = $1

      ORDER BY w.created_at DESC
      `,
      [req.memberId]
    );

    res.json({
      message: "Watchlist fetched successfully",
      watchlist: rows,
    });

  } catch (err) {
    console.error(
      "Failed to fetch watchlist:",
      err
    );

    res.status(500).json({
      error: "Failed to fetch watchlist",
    });
  }
});


module.exports = router;