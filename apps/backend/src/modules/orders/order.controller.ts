import { Request, Response } from 'express';
import prisma from '../../config/db';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_key';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount } = req.body;

    // Extract userId from JWT token if logged in
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        userId = decoded.id;
      } catch { /* token invalid, treat as guest */ }
    }

    // 1. Save order to PostgreSQL database
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        totalAmount,
        status: 'PENDING_PAYMENT',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            customizations: item.customizations || {}
          }))
        }
      },
      include: {
        items: true,
      },
    });

    // 2. Initialize Stripe (We check for a real key, otherwise use Demo Mode)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (stripeKey && stripeKey.startsWith('sk_')) {
      const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.productId === 'custom-atelier-build' ? 'Bespoke Atelier Formulation' : 'Olive Organics Product',
              description: item.customizations ? `Size: ${item.customizations?.size} | Fragrance: ${item.customizations?.fragrance}` : '',
            },
            unit_amount: Math.round(item.unitPrice * 100), // Stripe expects cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `http://localhost:5173/success?order_id=${order.id}`,
        cancel_url: `http://localhost:5173/build`,
        client_reference_id: order.id,
      });

      return res.status(201).json({ success: true, order, stripeUrl: session.url });
    }

    // 3. Fallback Demo Mode if no Stripe Key is provided yet
    res.status(201).json({ 
      success: true, 
      order, 
      stripeUrl: null, // Indicates demo mode
      paymentQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=pay_olive_${order.id}`
    });

  } catch (error) {
    console.error('[Stripe Order Error]', error);
    res.status(500).json({ success: false, error: 'Failed to process order checkout' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
