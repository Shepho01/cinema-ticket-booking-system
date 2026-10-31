
import http from "k6/http";
import { check } from "k6";
import { Counter, Rate } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

const SHOWTIME_ID = 1;
const SEAT_ID = 4; // D1 - must be available before testing
const CONCURRENT_REQUESTS = 10;

const successfulBookings = new Counter("successful_bookings");
const bookingConflicts = new Counter("booking_conflicts");
const unexpectedResponses = new Counter("unexpected_responses");
const raceFailures = new Rate("race_failures");

export const options = {
  scenarios: {
    booking_race: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      maxDuration: "30s",
    },
  },

  // Allow all 10 booking requests to be sent concurrently.
  batch: 10,
  batchPerHost: 10,

  thresholds: {
    race_failures: ["rate==0"],
    unexpected_responses: ["count==0"],
    "http_req_duration{endpoint:booking}": ["p(95)<1000"],
  },
};

function login(email, password) {
  const response = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      email,
      password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(
      `Login failed for ${email}: HTTP ${response.status}`
    );
  }

  const token = response.cookies.auth_token?.[0]?.value;

  if (!token) {
    throw new Error(
      `Authentication cookie missing for ${email}`
    );
  }

  return `auth_token=${token}`;
}

export default function () {
  const emailA = __ENV.TEST_USER_A_EMAIL;
  const passwordA = __ENV.TEST_USER_A_PASSWORD;

  const emailB = __ENV.TEST_USER_B_EMAIL;
  const passwordB = __ENV.TEST_USER_B_PASSWORD;

  if (!emailA || !passwordA || !emailB || !passwordB) {
    throw new Error(
      "Missing test credentials. Set TEST_USER_A_EMAIL, " +
      "TEST_USER_A_PASSWORD, TEST_USER_B_EMAIL, and " +
      "TEST_USER_B_PASSWORD."
    );
  }

  // Step 1: Authenticate both customers.
  const cookieA = login(emailA, passwordA);
  const cookieB = login(emailB, passwordB);

  console.log("Both customers authenticated.");
  console.log(
    `Submitting ${CONCURRENT_REQUESTS} competing booking requests...`
  );

  // Step 2: All requests attempt to reserve the same seat.
  const payload = JSON.stringify({
    showtimeId: SHOWTIME_ID,
    seatIds: [SEAT_ID],
  });

  const requests = Array.from(
    { length: CONCURRENT_REQUESTS },
    (_, index) => ({
      method: "POST",
      url: `${BASE_URL}/bookings`,
      body: payload,
      params: {
        headers: {
          "Content-Type": "application/json",
          Cookie: index % 2 === 0 ? cookieA : cookieB,
        },
        tags: {
          endpoint: "booking",
        },
        responseCallback: http.expectedStatuses(201, 409),
      },
    })
  );

  // Step 3: Submit the requests concurrently.
  const responses = http.batch(requests);

  let successes = 0;
  let conflicts = 0;
  let unexpected = 0;

  // Step 4: Analyse responses.
  for (const response of responses) {
    if (response.status === 201) {
      successes++;
      successfulBookings.add(1);
    } else if (response.status === 409) {
      conflicts++;
      bookingConflicts.add(1);
    } else {
      unexpected++;
      unexpectedResponses.add(1);

      console.error(
        `Unexpected HTTP ${response.status}: ${response.body}`
      );
    }
  }

  const passed =
    successes === 1 &&
    conflicts === CONCURRENT_REQUESTS - 1 &&
    unexpected === 0;

  raceFailures.add(!passed);

  console.log("================================");
  console.log("CONCURRENT BOOKING TEST RESULTS");
  console.log("================================");
  console.log(`Successful bookings: ${successes}`);
  console.log(`Booking conflicts: ${conflicts}`);
  console.log(`Unexpected responses: ${unexpected}`);
  console.log(`Result: ${passed ? "PASS" : "FAIL"}`);

  check(null, {
    "exactly one booking succeeds": () => successes === 1,
    "remaining bookings rejected": () =>
      conflicts === CONCURRENT_REQUESTS - 1,
    "no unexpected responses": () => unexpected === 0,
  });

  if (!passed) {
    throw new Error("Concurrent booking test failed");
  }
}
