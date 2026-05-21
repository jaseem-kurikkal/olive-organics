import { Router } from 'express';
import { getAdminStats } from './admin.controller';

const router = Router();

// Simple admin secret check — no JWT needed for now
router.get('/stats', (req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== (process.env.ADMIN_SECRET || 'olive_admin_2025')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
}, getAdminStats);

export default router;
