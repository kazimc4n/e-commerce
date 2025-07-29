const express = require('express');
const { body, query: expressQuery } = require('express-validator');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, getAllProducts);

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', getFeaturedProducts);

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search', searchProducts);

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
router.get('/category/:categoryId', getProductsByCategory);

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, getProduct);

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('shortDescription')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Short description cannot exceed 500 characters'),
  body('sku')
    .isLength({ min: 1, max: 100 })
    .withMessage('SKU is required and must not exceed 100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID')
], createProduct);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateProduct);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router; 