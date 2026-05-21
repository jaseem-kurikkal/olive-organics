import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalOrders, totalUsers, orders, recentUsers] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        include: {
          items: true,
          user: { select: { firstName: true, lastName: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.user.findMany({
        select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      stats: { totalOrders, totalUsers, totalRevenue },
      orders,
      recentUsers,
    });
  } catch (error) {
    console.error('[Admin Stats Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin data' });
  }
};
