import { validateSectionPayload, validateReorderPayload } from './cms.validation.js'

function stripDangerous(str) {
  if (typeof str !== 'string') return str
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
}

export function sanitizeCms(req, _res, next) {
  const TEXT_FIELDS = [
    'title', 'subtitle', 'primaryCTA', 'secondaryCTA',
    'primaryCTALink', 'secondaryCTALink',
  ]
  TEXT_FIELDS.forEach(f => {
    if (req.body[f] != null) req.body[f] = stripDangerous(req.body[f])
  })
  if (req.body.metadata && typeof req.body.metadata === 'object') {
    try {
      req.body.metadata = JSON.parse(stripDangerous(JSON.stringify(req.body.metadata)))
    } catch {
      delete req.body.metadata
    }
  }
  next()
}

export function validateSectionMw(req, res, next) {
  const errors = validateSectionPayload(req.body)
  if (errors.length) return res.status(400).json({ ok: false, errors })
  next()
}

export function validateReorderMw(req, res, next) {
  const errors = validateReorderPayload(req.body.sections)
  if (errors.length) return res.status(400).json({ ok: false, errors })
  next()
}
