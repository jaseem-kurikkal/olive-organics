import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json({ success: true, products });
  } catch (error) {
    console.error('[Product Fetch Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};
