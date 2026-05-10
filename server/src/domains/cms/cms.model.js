import mongoose from 'mongoose'

const cmsSectionSchema = new mongoose.Schema(
  {
    page:             { type: String, required: true },
    section:          { type: String, required: true },
    title:            { type: String, default: '' },
    subtitle:         { type: String, default: '' },
    primaryCTA:       { type: String, default: '' },
    secondaryCTA:     { type: String, default: '' },
    primaryCTALink:   { type: String, default: '/' },
    secondaryCTALink: { type: String, default: '/' },
    backgroundImage:  { type: String, default: '' },
    enabled:          { type: Boolean, default: true },
    order:            { type: Number, default: 0 },
    metadata:         { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

cmsSectionSchema.index({ page: 1, section: 1 }, { unique: true })
cmsSectionSchema.index({ page: 1, order: 1 })

export default mongoose.model('CmsSection', cmsSectionSchema)
