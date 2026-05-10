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
    const doc = await cmsService.upsertSection(page, section, {
      ...req.body,
      updatedBy: req.user?._id,
    })
    res.json({ ok: true, section: doc })
  } catch (err) {
    next(err)
  }
}

// PUT /api/cms/update — admin (page + section in body, single-field updates)
export async function updateSectionGeneric(req, res, next) {
  try {
    const { page, section, ...data } = req.body
    if (!page || !section) {
      return res.status(400).json({ ok: false, error: 'page and section are required' })
    }
    const doc = await cmsService.upsertSection(page, section, {
      ...data,
      updatedBy: req.user?._id,
    })
    res.json({ ok: true, section: doc })
  } catch (err) {
    next(err)
  }
}

// GET /api/cms/:page/config — admin: page-level section summary
export async function getPageConfig(req, res, next) {
  try {
    const sections = await cmsService.getAllSectionsForPage(req.params.page)
    const config = {
      page: req.params.page,
      sectionCount: sections.length,
      enabledCount: sections.filter(s => s.enabled).length,
      sections: sections.map(s => ({
        section: s.section,
        enabled: s.enabled,
        order: s.order,
        updatedAt: s.updatedAt,
        updatedBy: s.updatedBy,
      })),
    }
    res.json({ ok: true, config })
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
