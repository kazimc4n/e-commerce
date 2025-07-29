const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', getCart);

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', [
  body('productId')
    .isUUID()
    .withMessage('Product ID must be a valid UUID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], addToCart);

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], updateCartItem);

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', removeFromCart);

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', clearCart);

module.exports = router; 