import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { adminAuth } from '../middleware/adminAuth';
import { generateAndStoreArticles } from '../services/generationScheduler';

export const aiRouter = Router();

aiRouter.post(
  '/generate-article',
  adminAuth,
  asyncHandler(async (req, res) => {
    const count = Number(req.body?.count || 3);
    const posts = await generateAndStoreArticles(req.user, count);
    res.status(201).json({ data: posts });
  }),
);
