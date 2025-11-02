import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { storage } from '../utils/cloudinaryConfig.js';

const upload = multer({ storage });

// public
router.get('/', getProducts);
router.get('/:id', getProductById);

// admin protected - use field name 'image' in multipart form
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
