import { Router } from 'express';
import { createOrder, getOrder, verifyPayment } from './order.controller';

const router = Router();

router.post('/', createOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getOrder);

export default router;
