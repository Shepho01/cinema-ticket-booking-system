const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db/pool");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "All fields are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingMember = await pool.query(
      "SELECT id FROM members WHERE email = $1",
      [normalizedEmail]
    );

    if (existingMember.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO members (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email, created_at
      `,
      [firstName.trim(), lastName.trim(), normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      message: "Member created successfully.",
      member: result.rows[0]
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Internal server error."
    });
  }
});

module.exports = router;