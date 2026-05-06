import mongoose from 'mongoose';
import { SiteConfig } from '../models/SiteConfig.js';

const UI_KEY = 'ui';

const DEFAULT_UI_CONFIG = {
  hero:       {},
  bloomGrid:  [],
  benefits:   [],
  trust:      {},
  faq:        [],
  vision:     [],
  questions:  [],
};

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
}

export const getUIConfig = async (req, res, next) => {
  try {
    const doc = await SiteConfig.findOne({ key: UI_KEY });
    res.json(doc?.value ?? DEFAULT_UI_CONFIG);
  } catch (err) {
    next(err);
  }
};

export const updateUIConfig = async (req, res, next) => {
  try {
    const existing = await SiteConfig.findOne({ key: UI_KEY });
    const current = existing?.value ?? DEFAULT_UI_CONFIG;

    // Archive before overwriting
    await mongoose.connection.db.collection('ui_history').insertOne({
      config: current,
      updatedAt: new Date(),
    });

    const merged = deepMerge(current, req.body);

    const doc = await SiteConfig.findOneAndUpdate(
      { key: UI_KEY },
      { value: merged },
      { new: true, upsert: true },
    );
    res.json(doc.value);
  } catch (err) {
    next(err);
  }
};
