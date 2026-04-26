/**
 * @openapi
 * /api/auth/send-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP to a phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpSendRequest'
 *     responses:
 *       200:
 *         description: OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "OTP sent" }
 *       400:
 *         description: Invalid phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP and receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpVerifyRequest'
 *     responses:
 *       200:
 *         description: JWT issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/admin-login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login with email + password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: JWT issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/auth/demo-login:
 *   post:
 *     tags: [Auth]
 *     summary: Demo login — instant token for any role (dev/staging only)
 *     description: Returns a demo bearer token that bypasses OTP. Use for testing the API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, parent, admin, creator]
 *                 example: student
 *     responses:
 *       200:
 *         description: Demo token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               token: "demo-token-student"
 *               user:
 *                 name: "Demo Student"
 *                 role: "student"
 */

// ─── Reservations ─────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/reserve:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a pre-enrollment reservation
 *     description: Public endpoint — no auth required. Phone number must be unique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservationId: { type: string, example: "665a1b2c3d4e5f6789abcdef" }
 *                 message:       { type: string, example: "Reservation created successfully" }
 *       400:
 *         description: Missing required fields or invalid phone
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Phone number already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/reserve/check/{phone}:
 *   get:
 *     tags: [Reservations]
 *     summary: Check if a phone number is already reserved
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         example: "9876543210"
 *     responses:
 *       200:
 *         description: Existence check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists: { type: boolean, example: false }
 */

// ─── Student ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/student/stats:
 *   get:
 *     tags: [Student]
 *     summary: Get student learning stats (level, streak, modules, hours)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student stats
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentStats'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/student/progress:
 *   get:
 *     tags: [Student]
 *     summary: Get the student's current module and overall progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress snapshot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progress'
 */

/**
 * @openapi
 * /api/student/levels:
 *   get:
 *     tags: [Student]
 *     summary: List all levels with their status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Level list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:     { type: string }
 *                   name:   { type: string, example: "Level 2 — Control Flow" }
 *                   status: { type: string, enum: [completed, active, locked] }
 */

/**
 * @openapi
 * /api/student/curriculum:
 *   get:
 *     tags: [Student]
 *     summary: Get full curriculum tree (levels → modules)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Curriculum hierarchy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CurriculumLevel'
 */

// ─── Parent ───────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/parent/child:
 *   get:
 *     tags: [Parent]
 *     summary: Get child profile linked to this parent's phone number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Child profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

/**
 * @openapi
 * /api/parent/activity:
 *   get:
 *     tags: [Parent]
 *     summary: Get recent learning activity for the child
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity log
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   module: { type: string, example: "Introduction to Python" }
 *                   level:  { type: string, example: "Level 1" }
 *                   status: { type: string, enum: [completed, in-progress] }
 *                   date:   { type: string, format: date-time }
 */

/**
 * @openapi
 * /api/parent/billing:
 *   get:
 *     tags: [Parent]
 *     summary: Get billing/invoice details (null if not yet paid)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Billing record or null
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     amount:    { type: number, example: 6999 }
 *                     date:      { type: string, format: date-time }
 *                     status:    { type: string, example: "paid" }
 *                     invoiceId: { type: string, example: "INV-ABCDEF" }
 *                     grade:     { type: string }
 *                     programme: { type: string }
 *                 - type: 'null'
 */

/**
 * @openapi
 * /api/parent/payment-status:
 *   get:
 *     tags: [Parent]
 *     summary: Get full payment and reservation status for this parent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status with pricing breakdown when approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatus'
 */

// ─── Payments ─────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/payments/create-order:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Razorpay payment order
 *     description: Requires the parent's reservation to be in `approved` status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Razorpay order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentOrder'
 */

/**
 * @openapi
 * /api/payments/verify:
 *   post:
 *     tags: [Payments]
 *     summary: Verify Razorpay payment signature and mark reservation as paid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentVerifyRequest'
 *           example:
 *             razorpay_order_id: "order_xyz123ABC"
 *             razorpay_payment_id: "pay_abc456DEF"
 *             razorpay_signature: "abc123..."
 *     responses:
 *       200:
 *         description: Payment verified, reservation marked paid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       400:
 *         description: Signature mismatch — payment verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ─── ROB ──────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/rob/progress:
 *   get:
 *     tags: [ROB]
 *     summary: Get the student's full ROB XP, level, badges, and stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ROB progress
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RobProgress'
 */

/**
 * @openapi
 * /api/rob/xp:
 *   post:
 *     tags: [ROB]
 *     summary: Persist updated XP, level, badges, and lesson progress to the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RobProgress'
 *     responses:
 *       200:
 *         description: Saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 */

/**
 * @openapi
 * /api/rob/companion:
 *   get:
 *     tags: [ROB]
 *     summary: Get companion greeting data (streak, mood inputs, time of day)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companion state used to compute ROB's mood and greeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RobCompanion'
 *   post:
 *     tags: [ROB]
 *     summary: Save companion preferences (custom name, color, weakTopics, lastModule)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               robName:    { type: string, example: "NOVA" }
 *               robColor:   { type: string, enum: [cyan, purple, orange, green, pink] }
 *               weakTopics: { type: array, items: { type: string } }
 *               lastModule: { type: string, example: "mod3" }
 *     responses:
 *       200:
 *         description: Saved
 */

/**
 * @openapi
 * /api/rob/knowledge/{moduleId}:
 *   get:
 *     tags: [ROB]
 *     summary: Get published knowledge items for a module (student-facing)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         example: mod3
 *     responses:
 *       200:
 *         description: Published knowledge items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KnowledgeItem'
 */

/**
 * @openapi
 * /api/rob/quiz:
 *   get:
 *     tags: [ROB]
 *     summary: Get a random quiz question from published knowledge
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filter quiz by module (optional — omit for any module)
 *         example: mod3
 *     responses:
 *       200:
 *         description: A quiz question with multiple-choice options
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizQuestion'
 */

/**
 * @openapi
 * /api/rob/chat:
 *   post:
 *     tags: [ROB]
 *     summary: Ask ROB a question — keyword search over trained concepts
 *     description: >
 *       ROB searches its knowledge base for matching concepts.
 *       Confidence reflects how many keywords matched.
 *       If nothing matches, ROB prompts the student to ask their creator to train it.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RobChatRequest'
 *           example:
 *             message: "Help me make a timetable"
 *     responses:
 *       200:
 *         description: ROB's response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RobChatResponse'
 *             example:
 *               reply: "Let's build a smart school day plan."
 *               mood: "encouraging"
 *               xpReward: 5
 *               confidence: 80
 */

// ─── ROB (Creator) ────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/rob/train:
 *   post:
 *     tags: [ROB (Creator)]
 *     summary: Add a concept, quiz question, or hint to ROB's knowledge base
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KnowledgeItem'
 *           examples:
 *             concept:
 *               summary: Add a concept
 *               value:
 *                 type: concept
 *                 moduleId: mod3
 *                 content: "Machine learning is a subset of AI that lets systems learn from data without being explicitly programmed."
 *             quiz:
 *               summary: Add a quiz question
 *               value:
 *                 type: quiz
 *                 moduleId: mod3
 *                 question: "What is Training Data?"
 *                 explanation: "Training data is the set of examples used to teach an AI model."
 *                 options:
 *                   - { text: "The code that runs the AI", isCorrect: false }
 *                   - { text: "The examples the AI learns from", isCorrect: true }
 *                   - { text: "The computer processor", isCorrect: false }
 *                   - { text: "The internet connection", isCorrect: false }
 *     responses:
 *       201:
 *         description: Knowledge item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KnowledgeItem'
 */

/**
 * @openapi
 * /api/rob/creator/knowledge:
 *   get:
 *     tags: [ROB (Creator)]
 *     summary: List all knowledge items created by this creator
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All knowledge items for this creator
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KnowledgeItem'
 */

/**
 * @openapi
 * /api/rob/knowledge/{id}:
 *   delete:
 *     tags: [ROB (Creator)]
 *     summary: Delete a knowledge item by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6789abcdef"
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Knowledge item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/rob/publish/{moduleId}:
 *   post:
 *     tags: [ROB (Creator)]
 *     summary: Publish all knowledge items for a given module (makes them student-visible)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         example: mod3
 *     responses:
 *       200:
 *         description: Module published — students can now access this knowledge
 */

/**
 * @openapi
 * /api/rob/intelligence:
 *   get:
 *     tags: [ROB (Creator)]
 *     summary: Get creator analytics — knowledge counts, active students, weak topics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Intelligence report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalConcepts:  { type: integer, example: 12 }
 *                 totalQuizzes:   { type: integer, example: 8 }
 *                 totalHints:     { type: integer, example: 5 }
 *                 activeStudents: { type: integer, example: 47 }
 *                 weakTopics:     { type: array, items: { type: string }, example: ["loops", "functions"] }
 */

// ─── Creator ──────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/creator/stats:
 *   get:
 *     tags: [Creator]
 *     summary: Get creator dashboard stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: High-level creator metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:   { type: integer, example: 289 }
 *                 videos:     { type: integer, example: 24 }
 *                 watchTime:  { type: string, example: "1.2K h" }
 *                 completion: { type: string, example: "68%" }
 */

/**
 * @openapi
 * /api/creator/videos:
 *   get:
 *     tags: [Creator]
 *     summary: List all videos uploaded by this creator
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Video list with completion stats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:               { type: string }
 *                   title:             { type: string, example: "Intro to Python" }
 *                   moduleTitle:       { type: string }
 *                   level:             { type: integer }
 *                   isMustDo:          { type: boolean }
 *                   completionPercent: { type: integer, example: 92 }
 */

/**
 * @openapi
 * /api/creator/upload:
 *   post:
 *     tags: [Creator]
 *     summary: Upload a new video (stub — real upload uses Bunny.net CDN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:           { type: string, example: "Control Flow & Loops" }
 *               moduleTitle:     { type: string, example: "Module 3" }
 *               level:           { type: integer, example: 2 }
 *               isMustDo:        { type: boolean, example: true }
 *               taskDescription: { type: string }
 *     responses:
 *       200:
 *         description: Video record created
 */

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Platform-wide stats — total users, pending reservations, revenue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:          { type: integer, example: 142 }
 *                 pendingReservations: { type: integer, example: 7 }
 *                 totalRevenue:        { type: number,  example: 0 }
 *                 activeToday:         { type: integer, example: 0 }
 */

/**
 * @openapi
 * /api/admin/reservations:
 *   get:
 *     tags: [Admin]
 *     summary: List all reservations — latest 100, sorted by date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservation list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */

/**
 * @openapi
 * /api/admin/approve/{id}:
 *   post:
 *     tags: [Admin]
 *     summary: Approve a reservation — moves status from pending → approved, enabling payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665a1b2c3d4e5f6789abcdef"
 *     responses:
 *       200:
 *         description: Updated reservation
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/admin/payments:
 *   get:
 *     tags: [Admin]
 *     summary: List all completed payments (paid reservations)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:       { type: string }
 *                   userEmail: { type: string, format: email }
 *                   orderId:   { type: string, nullable: true }
 *                   amount:    { type: number, example: 6999 }
 *                   status:    { type: string, example: "paid" }
 */

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users — latest 100
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /api/admin/users/{id}/block:
 *   post:
 *     tags: [Admin]
 *     summary: Block a user account (sets isActive=false)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "User blocked" }
 */

/**
 * @openapi
 * /api/admin/users/{id}/unblock:
 *   post:
 *     tags: [Admin]
 *     summary: Unblock a user account (sets isActive=true)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "User unblocked" }
 */

// ─── Videos ───────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/videos/{id}/stream-url:
 *   get:
 *     tags: [Videos]
 *     summary: Get the Bunny.net CDN stream URL for a video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: v1
 *     responses:
 *       200:
 *         description: Streaming URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streamUrl: { type: string, format: uri, example: "https://vz-demo.b-cdn.net/v1/play_720p.mp4" }
 */

/**
 * @openapi
 * /api/videos/{id}/my-progress:
 *   get:
 *     tags: [Videos]
 *     summary: Get the authenticated user's watch progress for a video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Watch progress percent (0–100)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 percent: { type: integer, minimum: 0, maximum: 100, example: 0 }
 */

/**
 * @openapi
 * /api/videos/{id}/progress:
 *   post:
 *     tags: [Videos]
 *     summary: Save watch progress for a video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [percent]
 *             properties:
 *               percent:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 45
 *     responses:
 *       200:
 *         description: Progress saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 percent: { type: integer, example: 45 }
 */

// ─── Student Progress ─────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/progress/me:
 *   get:
 *     tags: [Student Progress]
 *     summary: Get the full progress document for the authenticated student
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full StudentProgress record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/StudentProgress'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/progress/dashboard:
 *   get:
 *     tags: [Student Progress]
 *     summary: Get dashboard summary — XP, streak, next module, badges
 *     description: Lightweight summary used to power the student dashboard. Faster than /me.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/ProgressDashboard'
 */

/**
 * @openapi
 * /api/progress/complete-module:
 *   post:
 *     tags: [Student Progress]
 *     summary: Mark a module as complete — awards XP, badge, unlocks next module, updates streak
 *     description: |
 *       Idempotent — completing the same module twice is a no-op (returns `alreadyCompleted: true`).
 *
 *       **Streak rules:**
 *       - Same day: no change
 *       - Next consecutive day: +1
 *       - Gap > 1 day: reset to 1
 *
 *       **Unlock logic:** Uses the sequential map `L1M1 → L1M2 → L1M3 → ... → L3M5`
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteModuleRequest'
 *           examples:
 *             withBadge:
 *               summary: Complete with XP and badge
 *               value:
 *                 moduleId: "L1M1"
 *                 xp: 50
 *                 badge: "Time Tamer"
 *             xpOnly:
 *               summary: Complete with XP only
 *               value:
 *                 moduleId: "L1M2"
 *                 xp: 30
 *     responses:
 *       200:
 *         description: Completion result with updated progress
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompleteModuleResponse'
 *             example:
 *               success: true
 *               alreadyCompleted: false
 *               data:
 *                 totalXP: 50
 *                 currentLevel: 1
 *                 streakDays: 1
 *                 streakUpdated: true
 *                 badges: ["Time Tamer"]
 *                 nextModule: "L1M2"
 *                 unlockedModules: ["L1M1", "L1M2"]
 *                 completedModules: ["L1M1"]
 *       400:
 *         description: moduleId is missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/progress/login-check:
 *   post:
 *     tags: [Student Progress]
 *     summary: Record login timestamp and detect comeback after inactivity
 *     description: |
 *       Call this on every dashboard load. Returns `comeback: true` if the student
 *       was away for 2+ days — use this to trigger the ROB comeback recap.
 *
 *       Does **not** modify streak (streak is only updated on module completion).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Login check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:      { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/LoginCheckResponse'
 *             example:
 *               success: true
 *               data:
 *                 comeback: true
 *                 daysAway: 3
 *                 streakDays: 5
 *                 totalXP: 450
 *                 currentLevel: 3
 */
