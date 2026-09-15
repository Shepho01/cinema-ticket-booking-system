const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        b.id AS "bookingId",
        b.member_id AS "memberId",

        mem.first_name AS "firstName",
        mem.last_name AS "lastName",
        mem.email,

        m.name AS "movieName",

        sh.id AS "showtimeId",
        sh.starts_at AS "startsAt",
        sh.ends_at AS "endsAt",
        sh.screen_id AS "screenId",
        sh.price AS "ticketPrice",

        b.status,
        b.total_price AS "totalPrice",
        b.created_at AS "createdAt",

        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'seatId', s.id,
              'seatLabel', s.seat_label,
              'seatRow', s.seat_row,
              'seatNumber', s.seat_number
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS seats

      FROM bookings b

      JOIN members mem
        ON mem.id = b.member_id

      JOIN showtimes sh
        ON sh.id = b.showtime_id

      JOIN movies m
        ON m.id = sh.movie_id

      LEFT JOIN booking_seats bs
        ON bs.booking_id = b.id

      LEFT JOIN seats s
        ON s.id = bs.seat_id

      GROUP BY
        b.id,
        b.member_id,
        mem.first_name,
        mem.last_name,
        mem.email,
        m.name,
        sh.id,
        sh.starts_at,
        sh.ends_at,
        sh.screen_id,
        sh.price,
        b.status,
        b.total_price,
        b.created_at

      ORDER BY b.created_at DESC;
    `);

    res.json({
      bookings: rows,
    });
  } catch (err) {
    console.error("Failed to fetch bookings:", err);

    res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
});

// GET BOOKING BY ID
router.get("/:id", async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    if (!Number.isInteger(bookingId)) {
      return res.status(400).json({
        error: "Booking ID must be a valid integer",
      });
    }

    const { rows } = await pool.query(
      `
      SELECT
        b.id AS "bookingId",
        b.member_id AS "memberId",

        mem.first_name AS "firstName",
        mem.last_name AS "lastName",
        mem.email,

        m.name AS "movieName",

        sh.id AS "showtimeId",
        sh.starts_at AS "startsAt",
        sh.ends_at AS "endsAt",
        sh.screen_id AS "screenId",
        sh.price AS "ticketPrice",

        b.status,
        b.total_price AS "totalPrice",
        b.created_at AS "createdAt",

        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'seatId', s.id,
              'seatLabel', s.seat_label,
              'seatRow', s.seat_row,
              'seatNumber', s.seat_number
            )
            ORDER BY s.seat_row, s.seat_number
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS seats

      FROM bookings b

      JOIN members mem
        ON mem.id = b.member_id

      JOIN showtimes sh
        ON sh.id = b.showtime_id

      JOIN movies m
        ON m.id = sh.movie_id

      LEFT JOIN booking_seats bs
        ON bs.booking_id = b.id

      LEFT JOIN seats s
        ON s.id = bs.seat_id

      WHERE b.id = $1

      GROUP BY
        b.id,
        b.member_id,
        mem.first_name,
        mem.last_name,
        mem.email,
        m.name,
        sh.id,
        sh.starts_at,
        sh.ends_at,
        sh.screen_id,
        sh.price,
        b.status,
        b.total_price,
        b.created_at
      `,
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    res.json({
      booking: rows[0],
    });
  } catch (err) {
    console.error("Failed to fetch booking:", err);

    res.status(500).json({
      error: "Failed to fetch booking",
    });
  }
});

// GET ALL BOOKINGS FOR A SPECIFIC MEMBER
router.get("/member/:memberId", async (req, res) => {
  try {
    const memberId = Number(req.params.memberId);

    if (!Number.isInteger(memberId)) {
      return res.status(400).json({
        error: "Member ID must be a valid integer",
      });
    }

    const { rows } = await pool.query(
      `
      SELECT
        b.id AS "bookingId",
        b.member_id AS "memberId",

        mem.first_name AS "firstName",
        mem.last_name AS "lastName",
        mem.email,

        m.name AS "movieName",

        sh.id AS "showtimeId",
        sh.starts_at AS "startsAt",
        sh.ends_at AS "endsAt",
        sh.screen_id AS "screenId",
        sh.price AS "ticketPrice",

        b.status,
        b.total_price AS "totalPrice",
        b.created_at AS "createdAt",

        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'seatId', s.id,
              'seatLabel', s.seat_label,
              'seatRow', s.seat_row,
              'seatNumber', s.seat_number
            )
            ORDER BY s.seat_row, s.seat_number
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS seats

      FROM bookings b

      JOIN members mem
        ON mem.id = b.member_id

      JOIN showtimes sh
        ON sh.id = b.showtime_id

      JOIN movies m
        ON m.id = sh.movie_id

      LEFT JOIN booking_seats bs
        ON bs.booking_id = b.id

      LEFT JOIN seats s
        ON s.id = bs.seat_id

      WHERE b.member_id = $1

      GROUP BY
        b.id,
        b.member_id,
        mem.first_name,
        mem.last_name,
        mem.email,
        m.name,
        sh.id,
        sh.starts_at,
        sh.ends_at,
        sh.screen_id,
        sh.price,
        b.status,
        b.total_price,
        b.created_at

      ORDER BY b.created_at DESC
      `,
      [memberId]
    );

    res.json({
      memberId,
      bookings: rows,
    });
  } catch (err) {
    console.error(
      "Failed to fetch member bookings:",
      err
    );

    res.status(500).json({
      error: "Failed to fetch member bookings",
    });
  }
});


// CREATE A BOOKING
router.post("/", requireAuth, async (req, res) => {
  const { showtimeId, seatIds } = req.body;

  if (
    !Number.isInteger(showtimeId) ||
    !Array.isArray(seatIds) ||
    seatIds.length === 0 ||
    !seatIds.every(Number.isInteger)
  ) {
    return res.status(400).json({
      error: "Valid showtimeId and seatIds are required",
    });
  }

  // Prevent things like [25, 25, 33]
  const uniqueSeatIds = [...new Set(seatIds)];

  if (uniqueSeatIds.length !== seatIds.length) {
    return res.status(400).json({
      error: "Duplicate seats were selected",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Find the showtime
    const showtimeResult = await client.query(
      `
      SELECT
        id,
        screen_id,
        price
      FROM showtimes
      WHERE id = $1
      `,
      [showtimeId]
    );

    if (showtimeResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Showtime not found",
      });
    }

    const showtime = showtimeResult.rows[0];

    // 2. Make sure all selected seats belong
    // to the screen used by this showtime
    const seatResult = await client.query(
      `
      SELECT
        id,
        seat_label AS "seatLabel",
        seat_row AS "seatRow",
        seat_number AS "seatNumber"
      FROM seats
      WHERE screen_id = $1
        AND id = ANY($2::int[])
      ORDER BY seat_row, seat_number
      `,
      [
        showtime.screen_id,
        uniqueSeatIds,
      ]
    );

    if (
      seatResult.rows.length !== uniqueSeatIds.length
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error:
          "One or more selected seats do not belong to this screening",
      });
    }

    // 3. Check whether any seats are already booked
    const bookedSeatsResult = await client.query(
      `
      SELECT
        bs.seat_id
      FROM booking_seats bs

      JOIN bookings b
        ON b.id = bs.booking_id

      WHERE bs.showtime_id = $1
        AND bs.seat_id = ANY($2::int[])
        AND b.status = 'confirmed'
      `,
      [
        showtimeId,
        uniqueSeatIds,
      ]
    );

    if (bookedSeatsResult.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        error:
          "One or more selected seats are already booked",
      });
    }

    // 4. Calculate price on the backend
    const totalPrice =
      Number(showtime.price) *
      uniqueSeatIds.length;

    // 5. Create the main booking
    const bookingResult = await client.query(
      `
      INSERT INTO bookings (
        member_id,
        showtime_id,
        status,
        total_price
      )
      VALUES ($1, $2, 'confirmed', $3)

      RETURNING
        id AS "bookingId",
        member_id AS "memberId",
        showtime_id AS "showtimeId",
        status,
        total_price AS "totalPrice",
        created_at AS "createdAt"
      `,
      [
        req.memberId,
        showtimeId,
        totalPrice,
      ]
    );

    const booking = bookingResult.rows[0];

    // 6. Add all selected seats
    await client.query(
      `
      INSERT INTO booking_seats (
        booking_id,
        showtime_id,
        seat_id
      )

      SELECT
        $1,
        $2,
        seat_id

      FROM UNNEST($3::int[]) AS seat_id
      `,
      [
        booking.bookingId,
        showtimeId,
        uniqueSeatIds,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        ...booking,
        seats: seatResult.rows,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(
      "Failed to create booking:",
      err
    );

    res.status(500).json({
      error: "Failed to create booking",
    });
  } finally {
    client.release();
  }
});

module.exports = router;