import http from "k6/http";
import { sleep, check } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  scenarios: {
    black_friday_spike: {
      executor: "ramping-arrival-rate",
      startRate: 50,
      timeUnit: "1s",
      preAllocatedVUs: 200,
      maxVUs: 1000,
      stages: [
        { target: 200, duration: "30s" },
        // { target: 500, duration: "1m" },
        // { target: 1000, duration: "1m" },
        { target: 0, duration: "30s" },
      ],
    },
  },
};

const BASE_URL = "http://localhost:4000/api";

export default function () {
  // 🔑 One idempotency key per logical order
  const idempotencyKey = uuidv4();

  const payload = JSON.stringify({
    items: [{ productId: "p1", quantity: 1 }],
  });

  const headers = {
    "Content-Type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };

  // 🔁 Simulate duplicate submissions (retry / double-click)
  for (let i = 0; i < 3; i++) {
    const res = http.post(`${BASE_URL}/orders`, payload, { headers });

    check(res, {
      "order create accepted": (r) =>
        r.status === 201 || r.status === 200 || r.status === 202,
    });

    sleep(0.1);
  }
}
