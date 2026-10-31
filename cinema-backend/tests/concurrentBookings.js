
import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

const SHOWTIME_ID = 1;
const SEAT_ID = 4;

const successfulBookings = new Counter("successful_bookings");
const bookingConflicts = new Counter("booking_conflicts");
const unexpectedResponses = new Counter("unexpected_responses");

export const options = {
  scenarios: {
    booking_race: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      maxDuration: "30s",
    },
  },
  thresholds: {
    unexpected_responses: ["count==0"],
    http_req_duration: ["p(95)<1000"],
  },
};

function login(email, password) {
  const response = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Login failed: HTTP ${response.status}`);
  }

  const token = response.cookies.auth_token?.[0]?.value;

  if (!token) {
    throw new Error("Missing authentication cookie");
  }

  return `auth_token=${token}`;
}

export default function () {
  const emailA = __ENV.TEST_USER_A_EMAIL;
  const passwordA = __ENV.TEST_USER_A_PASSWORD;
  const emailB = __ENV.TEST_USER_B_EMAIL;
  const passwordB = __ENV.TEST_USER_B_PASSWORD;

  if (!emailA || !passwordA || !emailB || !passwordB) {
    throw new Error("Missing test credentials");
  }

  const cookieA = login(emailA, passwordA);
  const cookieB = login(emailB, passwordB);

  const payload = JSON.stringify({
    showtimeId: SHOWTIME_ID,
    seatIds: [SEAT_ID],
  });

  // Launch 10 competing booking requests concurrently.
  const requests = Array.from({ length: 10 }, (_, index) => ({
    method: "POST",
    url: `${BASE_URL}/bookings`,
    body: payload,
    params: {
      headers: {
        "Content-Type": "application/json",
        Cookie: index % 2 === 0 ? cookieA : cookieB,
      },
      tags: { endpoint: "booking" },
    },
  }));

  const responses = http.batch(requests);

  let successes = 0;
  let conflicts = 0;

  for (const response of responses) {
    if (response.status === 201) {
      successes++;
      successfulBookings.add(1);
    } else if (response.status === 409) {
      conflicts++;
      bookingConflicts.add(1);
    } else {
      unexpectedResponses.add(1);
      console.error(`Unexpected HTTP ${response.status}: ${response.body}`);
    }
  }

  console.log(`Successful bookings: ${successes}`);
  console.log(`Booking conflicts: ${conflicts}`);

  check(null, {
    "exactly one booking succeeds": () => successes === 1,
    "nine bookings rejected": () => conflicts === 9,
  });

  if (successes !== 1 || conflicts !== 9) {
    throw new Error("Concurrent booking correctness test failed");
  }
}
