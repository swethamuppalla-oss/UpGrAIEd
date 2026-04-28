import { SiteConfig } from '../models/SiteConfig.js';

export const getAllConfig = async (req, res, next) => {
  try {
    const configs = await SiteConfig.find({});
    const result = {};
    for (const conf of configs) {
      result[conf.key] = conf.value;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getConfigByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const config = await SiteConfig.findOne({ key });
    if (!config) return res.status(404).json({ message: 'Config not found' });
    res.json(config.value);
  } catch (error) {
    next(error);
  }
};

export const upsertConfig = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const config = await SiteConfig.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (error) {
    next(error);
  }
};
