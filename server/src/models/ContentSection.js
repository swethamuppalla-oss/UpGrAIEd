import mongoose from 'mongoose';

/**
 * Stores editable content for marketing page sections.
 * Each document is keyed by `section` (e.g. "hero", "bloomGrid").
 * The `content` field holds the full section payload as a flexible Mixed doc.
 */
const contentSectionSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true, index: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const ContentSection = mongoose.model('ContentSection', contentSectionSchema);
