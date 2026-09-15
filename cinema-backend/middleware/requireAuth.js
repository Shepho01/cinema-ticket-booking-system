const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      error: "You must be signed in",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.memberId = payload.sub;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired session",
    });
  }
}

module.exports = requireAuth;