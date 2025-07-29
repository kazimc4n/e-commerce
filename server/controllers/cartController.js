const { validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        ci.id,
        ci.quantity,
        ci.created_at,
        p.id as product_id,
        p.name as product_name,
        p.slug,
        p.price,
        p.images,
        p.stock_quantity,
        p.is_active as product_active,
        (ci.quantity * p.price) as item_total
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC
    `, [req.user.id]);

    const cartItems = result.rows;
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.item_total), 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        itemCount: cartItems.length,
        subtotal: subtotal.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const productResult = await query(
      'SELECT id, name, price, stock_quantity, is_active FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const product = productResult.rows[0];

    if (!product.is_active) {
      return res.status(400).json({
        success: false,
        error: 'Product is not available'
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Only ${product.stock_quantity} items available`
      });
    }

    // Check if item is already in cart
    const existingItem = await query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    let result;
    
    if (existingItem.rows.length > 0) {
      // Update existing item
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          error: `Cannot add ${quantity} more items. Only ${product.stock_quantity - existingItem.rows[0].quantity} more items can be added`
        });
      }

      result = await query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [newQuantity, req.user.id, productId]
      );
    } else {
      // Add new item
      result = await query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, productId, quantity]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cartItem: result.rows[0] }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    // Check if product exists and get stock
    const productResult = await query(
      'SELECT stock_quantity, is_active FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const product = productResult.rows[0];

    if (!product.is_active) {
      return res.status(400).json({
        success: false,
        error: 'Product is not available'
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Only ${product.stock_quantity} items available`
      });
    }

    const result = await query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, req.user.id, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cartItem: result.rows[0] }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.user.id, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}; 