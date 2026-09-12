const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 1000,
  path: "/",
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const { rows } = await pool.query(
      `
      INSERT INTO members (
        first_name,
        last_name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email
      `,
      [
        firstName.trim(),
        lastName.trim(),
        normalizedEmail,
        passwordHash,
      ]
    );

    res.status(201).json({
      message: "Member registered successfully",
      member: rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    console.error(err);

    res.status(500).json({
      error: "Failed to register member",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { rows } = await pool.query(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        password_hash
      FROM members
      WHERE LOWER(email) = $1
      `,
      [normalizedEmail]
    );

    const member = rows[0];

    let validPassword = false;

    if (
      member &&
      member.password_hash.startsWith("$argon2")
    ) {
      validPassword = await argon2.verify(
        member.password_hash,
        password
      );
    }

    if (!member || !validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        sub: member.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("auth_token", token, cookieOptions);

    res.json({
      message: "Signed in successfully",
      member: {
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        email: member.email,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to sign in",
    });
  }
});


// GET CURRENTLY SIGNED-IN MEMBER
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    // No one has logged in yet
    if (!token) {
      return res.json({
        member: null,
      });
    }

    let payload;

    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({
        error: "Your session is invalid or has expired",
      });
    }

    const { rows } = await pool.query(
      `
      SELECT
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        email
      FROM members
      WHERE id = $1
      `,
      [payload.sub]
    );

    const member = rows[0];

    if (!member) {
      return res.status(401).json({
        error: "Member no longer exists",
      });
    }

    res.json({
      message: "Signed-in member fetched successfully",
      member,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch signed-in member",
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.json({
    message: "Signed out successfully",
  });
});

module.exports = router;