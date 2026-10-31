
import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

const FIRST_SHOWTIME_ID = 37;
const LAST_SHOWTIME_ID = 49;
const FIRST_SEAT_ID = 1;
const SEATS_PER_SHOWTIME = 80;

const TOTAL_VUS = Number(__ENV.VUS || 100);
const START_OFFSET = Number(__ENV.START_OFFSET || 0);
const TOTAL_CAPACITY =
  (LAST_SHOWTIME_ID - FIRST_SHOWTIME_ID + 1) * SEATS_PER_SHOWTIME;

const successfulBookings = new Counter("successful_bookings");
const bookingConflicts = new Counter("booking_conflicts");
const unexpectedResponses = new Counter("unexpected_responses");

export const options = {
  scenarios: {
    booking_load: {
      executor: "per-vu-iterations",
      vus: TOTAL_VUS,
      iterations: 1,
      maxDuration: "60s",
    },
  },
  thresholds: {
    unexpected_responses: ["count==0"],
    booking_conflicts: ["count==0"],
    "http_req_duration{endpoint:booking}": ["p(95)<1000"],
    checks: ["rate==1"],
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
    throw new Error("Authentication cookie missing");
  }

  return `auth_token=${token}`;
}


export function setup() {
  if (
    !Number.isInteger(TOTAL_VUS) ||
    TOTAL_VUS < 1 ||
    !Number.isInteger(START_OFFSET) ||
    START_OFFSET < 0 ||
    START_OFFSET + TOTAL_VUS > TOTAL_CAPACITY
  ) {
    throw new Error(
      `Invalid configuration: VUS=${TOTAL_VUS}, START_OFFSET=${START_OFFSET}. Maximum capacity is ${TOTAL_CAPACITY}.`
    );
  }

  const required = [
    "TEST_USER_A_EMAIL",
    "TEST_USER_A_PASSWORD",
    "TEST_USER_B_EMAIL",
    "TEST_USER_B_PASSWORD",
  ];

  for (const key of required) {
    if (!__ENV[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return {
    cookies: [
      login(__ENV.TEST_USER_A_EMAIL, __ENV.TEST_USER_A_PASSWORD),
      login(__ENV.TEST_USER_B_EMAIL, __ENV.TEST_USER_B_PASSWORD),
    ],
  };
}


export default function (data) {
  const index = START_OFFSET + __VU - 1;

  // Each showtime has 80 seats.
  const showtimeId =
    FIRST_SHOWTIME_ID + Math.floor(index / SEATS_PER_SHOWTIME);

  const seatId =
    FIRST_SEAT_ID + (index % SEATS_PER_SHOWTIME);

  const response = http.post(
    `${BASE_URL}/bookings`,
    JSON.stringify({
      showtimeId,
      seatIds: [seatId],
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: data.cookies[index % 2],
      },
      tags: { endpoint: "booking" },
      responseCallback: http.expectedStatuses(201, 409),
    }
  );

  if (response.status === 201) {
    successfulBookings.add(1);
  } else if (response.status === 409) {
    bookingConflicts.add(1);
    console.error(
      `Showtime ${showtimeId}, seat ${seatId}: booking conflict`
    );
  } else {
    unexpectedResponses.add(1);
    console.error(
      `Showtime ${showtimeId}, seat ${seatId}: HTTP ${response.status} - ${response.body}`
    );
  }

  check(response, {
    "booking created successfully": (r) => r.status === 201,
  });
}
