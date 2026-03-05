const express = require("express");
const router = express.Router();
const pool = require("../db/pool");


const getMovies = async (req, res) => {
    try {
    const { rows } = await pool.query("SELECT * FROM movies");
    res.json(rows);
    res.json({ message: "Movies fetched successfully", movies: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
    };

router.get("/", getMovies);

module.exports = router;
