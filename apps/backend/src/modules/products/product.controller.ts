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

export const getCustomOptions = async (req: Request, res: Response) => {
  try {
    const [sizes, ingredients, fragrances] = await Promise.all([
      prisma.customSize.findMany({ where: { isActive: true }, orderBy: { price: 'desc' } }),
      prisma.customIngredient.findMany({ where: { isActive: true }, orderBy: { price: 'desc' } }),
      prisma.customFragrance.findMany({ where: { isActive: true } }),
    ]);
    
    res.json({
      success: true,
      options: {
        sizes: sizes.map(s => ({ id: s.sizeId, name: s.name, price: s.price })),
        ingredients: ingredients.map(i => ({ id: i.ingredientId, name: i.name, price: i.price, desc: i.desc, color: i.color })),
        fragrances: fragrances.map(f => ({ id: f.fragranceId, name: f.name, price: f.price, color: f.color })),
      }
    });
  } catch (error) {
    console.error('[Custom Options Fetch Error]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch custom options' });
  }
};
