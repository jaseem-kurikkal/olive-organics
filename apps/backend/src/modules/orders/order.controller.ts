import { Request, Response } from 'express';
import prisma from '../../config/db';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

    // 2. Initialize Razorpay (We check for a real key, otherwise use Demo Mode)
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (razorpayKeyId && razorpayKeySecret) {
      const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret
      });
      
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise for INR, cents for USD)
        currency: 'USD', // You can change to INR if you want to charge in Rupees
        receipt: order.id,
      });

      return res.status(201).json({ success: true, order, razorpayOrderId: rzpOrder.id, razorpayKeyId });
    }

    // 3. Fallback Demo Mode if no Razorpay Key is provided yet
    res.status(201).json({ 
      success: true, 
      order, 
      razorpayOrderId: null, // Indicates demo mode
      paymentQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=pay_olive_${order.id}`
    });

  } catch (error) {
    console.error('[Razorpay Order Error]', error);
    res.status(500).json({ success: false, error: 'Failed to process order checkout' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) return res.status(500).json({ error: 'Razorpay secret missing' });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', razorpayKeySecret).update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature is valid, update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      });
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment verification failed' });
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
