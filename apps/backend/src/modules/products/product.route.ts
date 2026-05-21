import { Router } from 'express';
import { getProducts, getCustomOptions } from './product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/custom-options', getCustomOptions);

export default router;
