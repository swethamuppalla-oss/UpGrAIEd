import * as cmsService from './cms.service.js'

// GET /api/cms/:page — public
export async function getPublicSections(req, res, next) {
  try {
    const sections = await cmsService.getSectionsForPage(req.params.page)
    res.json({ ok: true, sections })
  } catch (err) {
    next(err)
  }
}

// GET /api/cms/:page/all — admin
export async function getAllSections(req, res, next) {
  try {
    const sections = await cmsService.getAllSectionsForPage(req.params.page)
    res.json({ ok: true, sections })
  } catch (err) {
    next(err)
  }
}

// PUT /api/cms/:page/:section — admin
export async function upsertSection(req, res, next) {
  try {
    const { page, section } = req.params
    const doc = await cmsService.upsertSection(page, section, req.body)
    res.json({ ok: true, section: doc })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/cms/:page/:section/toggle — admin
export async function toggleSection(req, res, next) {
  try {
    const { page, section } = req.params
    const { enabled } = req.body
    const doc = await cmsService.toggleSection(page, section, !!enabled)
    res.json({ ok: true, section: doc })
  } catch (err) {
    next(err)
  }
}

// POST /api/cms/:page/reorder — admin
export async function reorderSections(req, res, next) {
  try {
    const { sections } = req.body
    await cmsService.reorderSections(req.params.page, sections)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
