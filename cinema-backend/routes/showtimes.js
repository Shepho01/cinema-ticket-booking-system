const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET ALL SEATS + AVAILABILITY FOR A SHOWTIME
router.get("/:showtimeId/seats", async (req, res) => {
  try {
    const showtimeId = Number(req.params.showtimeId);

    if (!Number.isInteger(showtimeId)) {
      return res.status(400).json({
        error: "Showtime ID must be a valid integer",
      });
    }

    // First get information about the screening
    const showtimeResult = await pool.query(
      `
      SELECT
        sh.id AS "showtimeId",
        m.name AS "movieName",
        sh.screen_id AS "screenId",
        sh.starts_at AS "startsAt",
        sh.ends_at AS "endsAt",
        sh.price AS "ticketPrice"
      FROM showtimes sh
      JOIN movies m
        ON m.id = sh.movie_id
      WHERE sh.id = $1
      `,
      [showtimeId]
    );

    if (showtimeResult.rows.length === 0) {
      return res.status(404).json({
        error: "Showtime not found",
      });
    }

    const showtime = showtimeResult.rows[0];

    // Get every seat belonging to the screen
    // and determine whether it is available
    const seatsResult = await pool.query(
      `
      SELECT
        s.id AS "seatId",
        s.seat_row AS "seatRow",
        s.seat_number AS "seatNumber",
        s.seat_label AS "seatLabel",

        NOT EXISTS (
          SELECT 1
          FROM booking_seats bs

          JOIN bookings b
            ON b.id = bs.booking_id

          WHERE bs.showtime_id = $1
            AND bs.seat_id = s.id
            AND b.status = 'confirmed'
        ) AS "isAvailable"

      FROM seats s

      WHERE s.screen_id = $2

      ORDER BY
        s.seat_row,
        s.seat_number
      `,
      [
        showtimeId,
        showtime.screenId,
      ]
    );

    res.json({
      showtime,
      seats: seatsResult.rows,
    });
  } catch (err) {
    console.error(
      "Failed to fetch showtime seats:",
      err
    );

    res.status(500).json({
      error: "Failed to fetch showtime seats",
    });
  }
});

module.exports = router;