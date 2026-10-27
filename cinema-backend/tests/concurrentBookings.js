
const fs = require("node:fs");
const path = require("node:path");

// Load the two JWT tokens saved locally
const tokens = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "test-tokens.json"),
    "utf8"
  )
);

const API_URL = "http://localhost:5000";

// Replace these with a valid showtime and available seat
const showtimeId = 1;
const seatIds = [9];

async function createBooking(account, token) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `auth_token=${token}`,
    },
    body: JSON.stringify({
      showtimeId,
      seatIds,
    }),
  });

  const data = await response.json();

  return {
    account,
    status: response.status,
    data,
  };
}

async function runTest() {
  console.log("Starting concurrent booking test...");

  const results = await Promise.all([
    createBooking("Account A", tokens.accountA),
    createBooking("Account B", tokens.accountB),
  ]);

  console.log(JSON.stringify(results, null, 2));

  const statuses = results.map((result) => result.status);

  if (statuses.includes(201) && statuses.includes(409)) {
    console.log("PASS: Only one booking succeeded.");
  } else {
    console.log("CHECK: Unexpected booking results.");
  }
}

runTest().catch(console.error);
