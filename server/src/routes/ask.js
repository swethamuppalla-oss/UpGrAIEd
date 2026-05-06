import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

// Simple in-memory rate limit: max 5 requests per IP per minute
const ratemap = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const entry = ratemap.get(ip) || { count: 0, reset: now + 60_000 };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + 60_000;
  }
  entry.count++;
  ratemap.set(ip, entry);

  if (entry.count > 5) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }
  next();
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  'You are Bloom, a friendly AI tutor for students aged 8–14. ' +
  'Explain concepts clearly and simply, using analogies a child can relate to. ' +
  'Keep answers under 150 words. Never discuss anything off-topic or harmful.';

router.post('/', rateLimit, async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'question is required' });
  }
  if (question.length > 500) {
    return res.status(400).json({ error: 'question too long (max 500 characters)' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question.trim() }],
    });

    const answer = message.content[0]?.text ?? '';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Could not get an answer right now. Try again shortly.' });
  }
});

export default router;
