import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { adminAuth } from '../middleware/adminAuth';
import { auditLog } from '../services/auditLog';
import { getAdminSettings, updateAdminSettings } from '../services/adminSettings';
import { deletePost, getPost, listPosts, upsertPost } from '../services/postStore';
import { HttpError } from '../middleware/errorHandler';

export const adminRouter = Router();
adminRouter.use(adminAuth);

adminRouter.get(
  '/posts',
  asyncHandler(async (_req, res) => {
    res.json({ data: await listPosts(true) });
  }),
);

adminRouter.post(
  '/posts',
  asyncHandler(async (req, res) => {
    const post = await upsertPost(req.body, 'admin');
    await auditLog('post_create', req.user, { slug: post.slug });
    res.status(201).json({ data: post });
  }),
);

adminRouter.put(
  '/posts/:slug',
  asyncHandler(async (req, res) => {
    const existing = await getPost(req.params.slug, true);
    if (!existing) throw new HttpError(404, 'Post not found');
    const post = await upsertPost(req.body, 'admin', req.params.slug);
    await auditLog('post_update', req.user, { slug: post.slug });
    res.json({ data: post });
  }),
);

adminRouter.delete(
  '/posts/:slug',
  asyncHandler(async (req, res) => {
    await deletePost(req.params.slug);
    await auditLog('post_delete', req.user, { slug: req.params.slug });
    res.json({ data: { ok: true } });
  }),
);

adminRouter.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    res.json({ data: await getAdminSettings() });
  }),
);

adminRouter.put(
  '/settings',
  asyncHandler(async (req, res) => {
    const settings = await updateAdminSettings(req.body);
    await auditLog('settings_update', req.user);
    res.json({ data: settings });
  }),
);
