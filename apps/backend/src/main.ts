import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import orderRoutes from './modules/orders/order.route';
import userRoutes from './modules/users/user.route';
import productRoutes from './modules/products/product.route';
import adminRoutes from './modules/admin/admin.route';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'Olive Organics API is running seamlessly.' });
});

// Modular API Routes
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Olive Organics Backend]: API is running on http://localhost:${PORT}`);
});
