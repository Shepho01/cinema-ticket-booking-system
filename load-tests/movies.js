import http from "k6/http";
import { check, sleep } from "k6";

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
    http_req_failed: ["rate<0.01"],     // Less than 1% failures
    http_req_duration: ["p(95)<200"],   // p95 below 200 ms
  },
};

export default function () {
  const response = http.get("http://localhost:5000/movies");

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
