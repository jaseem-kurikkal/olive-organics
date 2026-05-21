import { Router } from 'express';
import { getAdminStats, updateOrderStatus } from './admin.controller';

const router = Router();

// Middleware to check admin secret
const requireAdmin = (req: any, res: any, next: any) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== (process.env.ADMIN_SECRET || 'olive_admin_2025')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};

router.get('/stats', requireAdmin, getAdminStats);
router.put('/orders/:orderId/status', requireAdmin, updateOrderStatus);

export default router;
