import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🤖 UpGrAIed API',
      version: '1.0.0',
      description: `
**AI-powered learning platform for students, parents and creators.**

---

### Quick start
1. Click **Authorize** and paste a demo token:
   - \`demo-token-student\` — student role
   - \`demo-token-parent\` — parent role
   - \`demo-token-admin\` — admin role
   - \`demo-token-creator\` — creator role
2. Expand any group and click **Try it out**

---

### Role matrix
| Tag | Required role |
|---|---|
| Auth / Reservations | Public |
| Student | student |
| Parent | parent |
| Payments | parent |
| ROB | any authenticated |
| ROB (Creator) | creator |
| Creator | creator or admin |
| Admin | admin |
| Videos | any authenticated |
      `.trim(),
      contact: {
        name: 'UpGrAIed Engineering',
        email: 'dev@upgraied.com',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local development' },
      { url: 'https://client-eight-eta-48.vercel.app', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste a JWT **or** a demo token: `demo-token-student` | `demo-token-parent` | `demo-token-admin` | `demo-token-creator`',
        },
      },
      schemas: {
        // ── Shared primitives ───────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Unauthorized' },
          },
        },

        // ── Auth ────────────────────────────────────────────────────────────
        OtpSendRequest: {
          type: 'object',
          required: ['phone'],
          properties: {
            phone: { type: 'string', example: '9876543210' },
          },
        },
        OtpVerifyRequest: {
          type: 'object',
          required: ['phone', 'otp'],
          properties: {
            phone: { type: 'string', example: '9876543210' },
            otp:   { type: 'string', example: '123456' },
          },
        },
        AdminLoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'admin@upgraied.com' },
            password: { type: 'string', format: 'password' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },

        // ── User ────────────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '665a1b2c3d4e5f6789abcdef' },
            name:      { type: 'string', example: 'Priya Sharma' },
            phone:     { type: 'string', example: '9876543210' },
            email:     { type: 'string', format: 'email', example: 'priya@example.com' },
            role:      { type: 'string', enum: ['student', 'parent', 'admin', 'creator'] },
            isActive:  { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Student ─────────────────────────────────────────────────────────
        Student: {
          type: 'object',
          properties: {
            name:             { type: 'string', example: 'Arjun Sharma' },
            grade:            { type: 'string', example: 'Grade 7' },
            programme:        { type: 'string', enum: ['Junior', 'Senior'] },
            currentLevel:     { type: 'integer', example: 3 },
            progress:         { type: 'integer', example: 45 },
            streak:           { type: 'integer', example: 7 },
            modulesCompleted: { type: 'integer', example: 12 },
            totalHours:       { type: 'number',  example: 18.5 },
          },
        },
        StudentStats: {
          type: 'object',
          properties: {
            currentLevel:     { type: 'integer', example: 3 },
            modulesCompleted: { type: 'integer', example: 12 },
            streak:           { type: 'integer', example: 7 },
            hoursLearned:     { type: 'number',  example: 18.5 },
          },
        },
        Progress: {
          type: 'object',
          properties: {
            currentModule: {
              type: 'object',
              properties: {
                _id:     { type: 'string' },
                title:   { type: 'string', example: 'Control Flow & Loops' },
                percent: { type: 'integer', example: 75 },
              },
            },
            overallPercent: { type: 'integer', example: 50 },
          },
        },

        // ── Parent ──────────────────────────────────────────────────────────
        Parent: {
          type: 'object',
          properties: {
            parentName: { type: 'string', example: 'Priya Sharma' },
            childName:  { type: 'string', example: 'Arjun Sharma' },
            grade:      { type: 'string', example: 'Grade 7' },
            email:      { type: 'string', format: 'email' },
            phone:      { type: 'string', example: '9876543210' },
            programme:  { type: 'string', enum: ['Junior', 'Senior'] },
          },
        },
        PaymentStatus: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['none', 'reserved', 'approved', 'paid'] },
            parentName:  { type: 'string' },
            childName:   { type: 'string' },
            grade:       { type: 'string' },
            email:       { type: 'string' },
            phone:       { type: 'string' },
            programme:   { type: 'string' },
            pricing:     { type: 'object' },
          },
        },

        // ── Module ──────────────────────────────────────────────────────────
        Module: {
          type: 'object',
          properties: {
            _id:             { type: 'string', example: 'mod3' },
            title:           { type: 'string', example: 'Control Flow & Loops' },
            status:          { type: 'string', enum: ['completed', 'active', 'locked'] },
            percent:         { type: 'integer', example: 75 },
            isMustDo:        { type: 'boolean', example: true },
            taskDescription: { type: 'string', example: 'Write a program with if/else and a for loop.' },
          },
        },
        CurriculumLevel: {
          type: 'object',
          properties: {
            _id:     { type: 'string' },
            name:    { type: 'string', example: 'Level 2 — Control Flow' },
            status:  { type: 'string', enum: ['completed', 'active', 'locked'] },
            modules: { type: 'array', items: { $ref: '#/components/schemas/Module' } },
          },
        },

        // ── Quiz ────────────────────────────────────────────────────────────
        QuizOption: {
          type: 'object',
          properties: {
            text:      { type: 'string', example: 'The examples the AI learns from' },
            isCorrect: { type: 'boolean', example: true },
          },
        },
        QuizQuestion: {
          type: 'object',
          properties: {
            available:   { type: 'boolean', example: true },
            question:    { type: 'string', example: 'What is Training Data?' },
            explanation: { type: 'string', example: 'Training data is the set of examples used to teach an AI model.' },
            options:     { type: 'array', items: { $ref: '#/components/schemas/QuizOption' } },
          },
        },
        QuizSubmission: {
          type: 'object',
          required: ['questionId', 'selectedIndex'],
          properties: {
            questionId:    { type: 'string' },
            selectedIndex: { type: 'integer', example: 1 },
            moduleId:      { type: 'string' },
          },
        },

        // ── Payment ─────────────────────────────────────────────────────────
        PaymentOrder: {
          type: 'object',
          properties: {
            orderId:  { type: 'string', example: 'order_xyz123ABC' },
            amount:   { type: 'integer', example: 699900, description: 'Amount in paise (₹6999 = 699900)' },
            currency: { type: 'string', example: 'INR' },
            key:      { type: 'string', example: 'rzp_test_...' },
          },
        },
        PaymentVerifyRequest: {
          type: 'object',
          required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'],
          properties: {
            razorpay_order_id:   { type: 'string' },
            razorpay_payment_id: { type: 'string' },
            razorpay_signature:  { type: 'string' },
          },
        },

        // ── ROB ─────────────────────────────────────────────────────────────
        RobProgress: {
          type: 'object',
          properties: {
            xp:               { type: 'integer', example: 450 },
            level:            { type: 'integer', example: 3 },
            badges:           { type: 'array', items: { type: 'string' }, example: ['first-spark', 'quiz-master'] },
            lessonsCompleted: { type: 'array', items: { type: 'string' } },
            questionsAnswered:{ type: 'integer', example: 24 },
            correctAnswers:   { type: 'integer', example: 18 },
            xpToday:          { type: 'integer', example: 80 },
            robName:          { type: 'string', example: 'NOVA' },
            robColor:         { type: 'string', enum: ['cyan', 'purple', 'orange', 'green', 'pink'], example: 'cyan' },
          },
        },
        RobCompanion: {
          type: 'object',
          properties: {
            timeOfDay:      { type: 'string', enum: ['morning', 'afternoon', 'evening', 'night'] },
            daysSinceLogin: { type: 'integer', example: 0 },
            streak:         { type: 'integer', example: 5 },
            robName:        { type: 'string', example: 'NOVA' },
            robColor:       { type: 'string', example: 'cyan' },
            comebackRecap:  { type: 'boolean', example: false },
            userName:       { type: 'string', example: 'Arjun' },
          },
        },
        RobChatRequest: {
          type: 'object',
          required: ['question'],
          properties: {
            question: { type: 'string', example: 'What is a neural network?' },
            moduleId: { type: 'string', example: 'mod3' },
          },
        },
        RobChatResponse: {
          type: 'object',
          properties: {
            answer:     { type: 'string', example: "A neural network is a system of algorithms that recognises underlying relationships in data, loosely modelled on the human brain." },
            confidence: { type: 'integer', minimum: 0, maximum: 100, example: 80 },
            mood:       { type: 'string', example: 'encouraging' },
            xpReward:   { type: 'integer', example: 5 },
          },
        },
        KnowledgeItem: {
          type: 'object',
          properties: {
            _id:       { type: 'string' },
            type:      { type: 'string', enum: ['concept', 'quiz', 'hint'] },
            content:   { type: 'string', example: 'Machine learning is a subset of AI...' },
            moduleId:  { type: 'string', example: 'mod3' },
            published: { type: 'boolean', example: true },
            question:  { type: 'string', description: 'Set when type=quiz' },
            options:   { type: 'array', items: { $ref: '#/components/schemas/QuizOption' } },
            explanation: { type: 'string' },
          },
        },

        // ── Reservation ─────────────────────────────────────────────────────
        Reservation: {
          type: 'object',
          required: ['parentName', 'childName', 'grade', 'phone', 'email'],
          properties: {
            parentName: { type: 'string', example: 'Priya Sharma' },
            childName:  { type: 'string', example: 'Arjun Sharma' },
            grade:      { type: 'string', example: 'Grade 7' },
            city:       { type: 'string', example: 'Bangalore' },
            phone:      { type: 'string', example: '9876543210' },
            email:      { type: 'string', format: 'email', example: 'priya@example.com' },
            source:     { type: 'string', example: 'Instagram' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth',           description: '🔐 Login, OTP, demo tokens — all public' },
      { name: 'Reservations',   description: '📋 Pre-enrollment reservation — public' },
      { name: 'Student',        description: '🎓 Progress, levels, curriculum — requires **student** role' },
      { name: 'Parent',         description: '👨‍👩‍👧 Child info, billing, payment status — requires **parent** role' },
      { name: 'Payments',       description: '💳 Razorpay order & verification — requires **parent** role' },
      { name: 'ROB',            description: '🤖 ROB AI companion: XP, quiz, chat — requires any auth' },
      { name: 'ROB (Creator)',   description: '🧪 ROB training & knowledge management — requires **creator** role' },
      { name: 'Creator',        description: '🎬 Stats, video management — requires **creator** or **admin**' },
      { name: 'Admin',          description: '🛡️ Users, reservations, approvals — requires **admin** role' },
      { name: 'Videos',         description: '📹 Streaming URLs and watch progress — requires any auth' },
    ],
  },
  apis: ['./src/docs/*.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
