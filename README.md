# Scalable, Idempotent E-commerce Order System

This repository demonstrates how to design and implement a **real-world e-commerce order system** that remains correct under retries, traffic spikes, crashes, and asynchronous payments.

It is not a feature demo.  
It is a system designed to behave **predictably when reality intervenes**.

The architecture is intentionally simple on the surface, yet disciplined underneath — the same balance used in production systems that survive high-pressure events such as Black Friday sales.

---

## Why This Project Exists

Most order systems fail in subtle but expensive ways. Inventory is oversold during spikes, customers are charged twice, orders are confirmed multiple times, retries corrupt state, and systems collapse under partial failures.

These failures rarely appear in happy-path demos.  
They appear when **retries, delays, and crashes** happen together.

This project exists to show how to design for those moments.

---

## Core Ideas Demonstrated

This system is built around a small set of non-negotiable ideas:

- Orders move through a **strict, enforced state machine**
- Every boundary is **idempotent**
- Heavy work is processed **asynchronously**
- Failures pause the system, not corrupt it
- Correctness is prioritized over raw throughput

---

## Mental Model (Airport Analogy)

If you understand how an airport works, you already understand this system.

Passengers do not board a plane simply because they arrive.  
They move through a deliberate sequence: entry, security, boarding approval, boarding.

Repeating a step does not cause duplication.  
Skipping a step is not allowed.

Orders in this system behave the same way.

---

## Order Lifecycle

Every order progresses through a single, enforced path:

CREATED → INVENTORY_RESERVED → PAYMENT_PENDING → PAID → CONFIRMED

Each transition validates the previous state, is safe to retry, and cannot be skipped or repeated.

---

## High-Level Architecture

Client (Web / App)  
→ API (Node.js + Express)  
→ Redis Queue (BullMQ)  
→ Worker Processes  
→ MongoDB

The API accepts intent quickly. Redis absorbs spikes. Workers process reliably. MongoDB stores authoritative state.

---

## Technology Stack

- Frontend: React (TypeScript)
- API: Node.js + Express (TypeScript)
- Database: MongoDB
- Queue: BullMQ
- Broker: Redis
- Payments: Stripe (India-compliant)
- Load Testing: k6
- Containerization: Docker & Docker Compose

---

## Idempotency (System-Wide)

Retries are not edge cases — they are expected behavior.

This system is idempotent at every critical boundary:
- Order creation uses an Idempotency-Key
- Inventory reservation exits safely on retries
- Payment creation reuses existing PaymentIntents
- Stripe webhooks ignore duplicate events
- Finalization workers are retry-safe

---

## Inventory Handling

Inventory is treated as a reservation, not a counter. Stock is reserved atomically and conditionally to prevent overselling under concurrency.

---

## Payments & Stripe Integration

Payments are treated as external, asynchronous systems. Payment intents are idempotent, webhooks are verified, retried safely, and used to advance order state via queues.

---

## Observability

The system uses structured, order-centric logging. Every meaningful event logs order ID, state, action taken, and idempotency outcome.

---

## Load Testing

Load testing is performed using k6 with traffic spikes and retry storms. Success is defined by correctness, not maximum throughput.

---

## Failure Drills

Workers are killed mid-job, webhooks are replayed, APIs are retried, and services are restarted. The system converges safely without data corruption.

---

## Project Structure

apps/
  api/
  worker/
packages/
  shared/
load-tests/
docker/

---

## Running with Docker (Recommended)

Create a .env file at the root with Mongo, Redis, and Stripe credentials.

Run:
docker compose up --build

API runs on http://localhost:4000

Stripe webhooks can be tested locally using the Stripe CLI.

---

## Closing Thought

Scaling is not about handling more traffic.

Scaling is about handling more failure — without losing trust, money, or data.
