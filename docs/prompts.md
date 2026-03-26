# UpGrAIEd — Prompt Log

All prompts used to build this project, in order.

---

## STEP 1 — Project Foundation

```
We are building a SaaS platform called UpgrAIed.

Tech stack:
* Node.js (Express)
* MongoDB (Mongoose)

Architecture:
* /src
  /controllers
  /services
  /models
  /routes
  /middleware
  /utils

Tasks:
1. Initialize Express app
2. Setup MongoDB connection
3. Create folder structure
4. Add basic route (/health)
5. Add global error handler
6. Add environment config (.env)

Goal:
A clean, production-ready backend foundation.

IMPORTANT:
Do not implement business logic yet.
Only setup structure.
```

---

## STEP 2 — Authentication System

```
Continue from STEP 1.

Roles:
* Parent
* Student
* Admin

Tasks:
1. Create User model (with role field)
2. Implement OTP-based login (mock OTP)
3. Generate JWT token after login
4. Create auth middleware
5. Implement role-based access control (RBAC)

APIs:
* POST /auth/send-otp
* POST /auth/verify-otp

Rules:
* Only 1 active session per user
* Store session/token reference

Goal:
Secure and modular authentication system.
```

---

## STEP 3 — Reservation & Enrollment Flow

```
Continue from STEP 2.

Business flow:
1. Parent reserves seat (no payment)
2. Status = RESERVED
3. Admin approves
4. Payment enabled
5. Payment success → ACTIVE

Tasks:
1. Create models:
   * Parent
   * Student
   * Enrollment
2. Add status field (RESERVED, APPROVED, ACTIVE)
3. Create APIs:
   * POST /reserve
   * POST /admin/approve
   * GET /admin/reservations
4. Link student to parent

Goal:
Implement controlled access flow before payment.
```

---

## STEP 4 — Course & Content Structure

```
Continue from STEP 3.

Hierarchy:
* Program
* Level
* Module
* Video

Tasks:
1. Create models:
   * Program
   * Level
   * Module
   * Video

2. Define relationships:
   * Program → Levels → Modules → Videos

3. Add APIs:
   * GET /programs
   * GET /levels/:id
   * GET /modules/:id

Goal:
Structured learning system ready for progression logic.
```

---

## STEP 5 — Progression System

```
Continue from STEP 4.

Rules:
* Each Level has 1 MUST DO module
* Next Level unlocks only after MUST DO is completed

Tasks:
1. Add field: isMustDo (boolean) in Module
2. Create Progress model:
   * userId
   * moduleId
   * completed
3. Add API:
   * POST /progress/complete
4. Add logic:
   * Check if MUST DO completed
   * Unlock next level

Goal:
Controlled progression system.
```

---

## STEP 6 — Video Progress Tracking

```
Continue from STEP 5.

Tasks:
1. Create VideoProgress model:
   * userId
   * videoId
   * percentWatched

2. Add API:
   * POST /videos/:id/progress

Rules:
* Mark complete if >= 85%

Goal:
Track user engagement with videos.
```

---

## STEP 7 — Payment System

```
Continue from STEP 6.

Tasks:
1. Create Transaction model:
   * userId
   * amount
   * status

2. Implement:
   * POST /payment/create
   * POST /payment/verify

Flow:
* Payment success → update enrollment to ACTIVE

Goal:
Secure and traceable payment flow.
```

---

## STEP 8 — Admin Features

```
Continue from STEP 7.

Tasks:
1. APIs:
   * GET /admin/users
   * GET /admin/payments
   * GET /admin/analytics

2. Features:
   * View total users
   * View total revenue
   * View reservations

Goal:
Basic admin control system.
```

---

## STEP 9 — Repo Setup & Branch Strategy

```
STEP 1 — CLEAN REPO SETUP (DO THIS FIRST)

In your project folder:
rm -rf node_modules
rm -rf .next
rm -rf dist

Ensure structure is clean:
/src
  /controllers
  /services
  /models
  /routes
  /middleware
  /config

Initialize Git properly:
git init
git add .
git commit -m "Initial clean MVP setup"
git branch -M main
git remote add origin https://github.com/swethamuppalla-oss/UpGrAIEd.git
git push -u origin main

BRANCH STRATEGY:
git checkout -b dev

From now:
main → stable
dev  → your work

MVP BUILD ORDER (PHASES):

Phase 1 (Today):
- Auth (OTP mock)
- Parent → Reserve flow
- Basic dashboard

Phase 2:
- Course + video structure
- Video player

Phase 3:
- Payment (test mode)
- Unlock logic

Phase 4:
- UI polish
- Admin panel

UI STRATEGY:
- Tailwind CSS
- Simple layout
- Mobile-first

Pages needed for MVP:
- Login
- Reserve page
- Dashboard
- Video player
```

---

## STEP 10 — Save Prompts

```
Create:
docs/prompts.md

Every prompt you use → save there
```
