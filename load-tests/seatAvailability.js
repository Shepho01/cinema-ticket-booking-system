
import http from "k6/http";
import { check, sleep } from "k6";

const SHOWTIME_ID = 1; 


export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "10s", target: 250 },
    { duration: "20s", target: 500 },
    { duration: "20s", target: 1000 },
    { duration: "30s", target: 1000 },
    { duration: "10s", target: 0 },
  ],

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<200"],
    checks: ["rate==1"],
  },
};



export default function () {
  const response = http.get(
    `http://localhost:5000/showtimes/${SHOWTIME_ID}/seats`
  );

  let body = null;

  if (response.status === 200) {
    try {
      body = response.json();
    } catch (error) {
      // Invalid JSON will cause the response checks to fail.
    }
  }

  check(response, {
    "status is 200": (r) => r.status === 200,

    "response contains seats": () =>
      Array.isArray(body?.seats),

    "showtime ID matches": () =>
      Number(body?.showtime?.showtimeId) === SHOWTIME_ID,

    "seats contain availability data": () =>
      Array.isArray(body?.seats) &&
      body.seats.length > 0 &&
      body.seats.every(
        (seat) =>
          typeof seat.isAvailable === "boolean"
      ),
  });

  sleep(1);
}
