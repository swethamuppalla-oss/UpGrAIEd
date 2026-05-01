import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { connectDB } from './config/db.js'
import { createApp } from './app.js'

await connectDB()

const app = createApp()

// Swagger UI — dark branded theme
const swaggerUiOptions = {
  customSiteTitle: '🤖 UpGrAIed API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    tryItOutEnabled: true,
  },
  customCss: `
    body { background: #0F0B1C !important; }
    .swagger-ui { background: #0F0B1C; font-family: 'Inter', system-ui, sans-serif; }
    .swagger-ui .topbar { background: linear-gradient(135deg, #130E24, #1A1430); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 20px; }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::before { content: '🤖  UpGrAIed API'; color: white; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info { background: linear-gradient(135deg, #130E24, #1A1430); border-radius: 16px; padding: 28px 32px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px; }
    .swagger-ui .info .title { color: white !important; font-size: 28px; font-weight: 800; }
    .swagger-ui .info .description p, .swagger-ui .info .description td, .swagger-ui .info .description th { color: rgba(255,255,255,0.75) !important; }
    .swagger-ui .info .description table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    .swagger-ui .info .description th { color: rgba(255,255,255,0.5) !important; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 6px 10px; text-align: left; font-size: 12px; }
    .swagger-ui .info .description td { padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .swagger-ui .opblock-tag { background: rgba(255,255,255,0.03) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 12px !important; margin-bottom: 8px !important; color: white !important; }
    .swagger-ui .opblock-tag:hover { background: rgba(255,255,255,0.06) !important; }
    .swagger-ui .opblock-tag-section h3 { color: white !important; }
    .swagger-ui .opblock { background: rgba(255,255,255,0.02) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 10px !important; margin-bottom: 6px !important; }
    .swagger-ui .opblock .opblock-summary { border-radius: 10px; }
    .swagger-ui .opblock .opblock-summary-method { border-radius: 6px !important; font-weight: 700 !important; min-width: 70px !important; text-align: center !important; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #0284c7 !important; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #16a34a !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626 !important; }
    .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #d97706 !important; }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #7c3aed !important; }
    .swagger-ui .opblock .opblock-summary-path { color: rgba(255,255,255,0.9) !important; font-family: 'Monaco', 'Menlo', monospace !important; font-size: 14px !important; }
    .swagger-ui .opblock .opblock-summary-description { color: rgba(255,255,255,0.5) !important; font-size: 13px !important; }
    .swagger-ui .opblock-body, .swagger-ui .opblock-section { background: #0F0B1C !important; }
    .swagger-ui section.models, .swagger-ui .model-box { background: rgba(255,255,255,0.02) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 10px !important; }
    .swagger-ui .model-title { color: white !important; }
    .swagger-ui .model { color: rgba(255,255,255,0.8) !important; }
    .swagger-ui label, .swagger-ui .parameter__name, .swagger-ui table.headers td, .swagger-ui .response-col_status { color: rgba(255,255,255,0.8) !important; }
    .swagger-ui .parameter__type, .swagger-ui .prop-type { color: #00D4FF !important; }
    .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.15) !important; color: white !important; border-radius: 8px !important; }
    .swagger-ui .btn { border-radius: 8px !important; font-weight: 600 !important; }
    .swagger-ui .btn.authorize { background: linear-gradient(135deg, #FF5C28, #7B3FE4) !important; border: none !important; color: white !important; padding: 10px 20px !important; }
    .swagger-ui .btn.execute { background: #7B3FE4 !important; border-color: #7B3FE4 !important; color: white !important; }
    .swagger-ui .btn.try-out__btn { background: rgba(255,255,255,0.08) !important; border: 1px solid rgba(255,255,255,0.2) !important; color: white !important; }
    .swagger-ui .highlight-code { background: rgba(0,0,0,0.5) !important; border-radius: 8px !important; }
    .swagger-ui .microlight { color: rgba(255,255,255,0.85) !important; }
    .swagger-ui .response-col_links, .swagger-ui .responses-wrapper { background: rgba(255,255,255,0.02) !important; }
    .swagger-ui .tab li { color: rgba(255,255,255,0.6) !important; }
    .swagger-ui .tab li.active { color: white !important; border-bottom: 2px solid #7B3FE4 !important; }
    .swagger-ui section.models h4 { color: white !important; }
    .swagger-ui .servers > label select { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.15) !important; color: white !important; border-radius: 8px !important; }
    .swagger-ui .servers > label { color: rgba(255,255,255,0.7) !important; }
    .swagger-ui .auth-wrapper, .swagger-ui .dialog-ux .modal-ux { background: #1A1430 !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 16px !important; }
    .swagger-ui .dialog-ux .modal-ux-header { background: rgba(255,255,255,0.04) !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; border-radius: 16px 16px 0 0 !important; }
    .swagger-ui .dialog-ux .modal-ux-header h3 { color: white !important; }
    .swagger-ui .auth-container .wrapper { color: rgba(255,255,255,0.8) !important; }
    .swagger-ui .scheme-container { background: rgba(255,255,255,0.02) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 12px !important; }
  `,
}
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec))

// DB connectivity test (local dev helper)
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await mongoose.connection.db
      .collection('test')
      .insertOne({ message: 'hello', time: new Date() })
    res.json({ status: 'DB write success', id: result.insertedId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000)
})
