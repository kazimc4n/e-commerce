const { validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[çğıöşü]/g, (match) => {
      const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u' };
      return map[match];
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      featured,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let whereClause = 'WHERE p.is_active = true';
    const queryParams = [];
    let paramCount = 1;

    // Add filters
    if (category) {
      whereClause += ` AND p.category_id = $${paramCount}`;
      queryParams.push(category);
      paramCount++;
    }

    if (minPrice) {
      whereClause += ` AND p.price >= $${paramCount}`;
      queryParams.push(parseFloat(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      whereClause += ` AND p.price <= $${paramCount}`;
      queryParams.push(parseFloat(maxPrice));
      paramCount++;
    }

    if (featured === 'true') {
      whereClause += ` AND p.is_featured = true`;
    }

    if (search) {
      whereClause += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Build the main query
    const baseQuery = `
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total ${baseQuery}`,
      queryParams
    );
    const totalProducts = parseInt(countResult.rows[0].total);

    // Add sorting and pagination
    const sortColumn = ['name', 'price', 'created_at'].includes(sortBy) ? `p.${sortBy}` : 'p.created_at';
    const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    
    queryParams.push(parseInt(limit), offset);
    
    const productsResult = await query(
      `SELECT 
        p.id, p.name, p.slug, p.description, p.short_description,
        p.sku, p.price, p.compare_price, p.stock_quantity,
        p.images, p.is_featured, p.created_at,
        c.name as category_name, c.slug as category_slug
       ${baseQuery}
       ORDER BY ${sortColumn} ${order}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      queryParams
    );

    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.json({
      success: true,
      data: {
        products: productsResult.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.*, 
        c.name as category_name, 
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const product = result.rows[0];

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      stockQuantity,
      lowStockThreshold,
      weight,
      dimensions,
      categoryId,
      tags,
      images,
      isFeatured,
      metaTitle,
      metaDescription
    } = req.body;

    const slug = generateSlug(name);

    // Check if SKU already exists
    const existingSku = await query('SELECT id FROM products WHERE sku = $1', [sku]);
    if (existingSku.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Product with this SKU already exists'
      });
    }

    const result = await query(`
      INSERT INTO products (
        name, slug, description, short_description, sku, price, compare_price, cost_price,
        stock_quantity, low_stock_threshold, weight, dimensions, category_id, tags, images,
        is_featured, meta_title, meta_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `, [
      name, slug, description, shortDescription, sku, price, comparePrice, costPrice,
      stockQuantity, lowStockThreshold, weight, dimensions, categoryId, tags, images,
      isFeatured || false, metaTitle, metaDescription
    ]);

    const product = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during product creation'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    // Generate new slug if name is being updated
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      updateFields.push(`${dbKey} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    });

    values.push(id);

    const result = await query(`
      UPDATE products 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND is_active = true
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const product = result.rows[0];

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during product update'
    });
  }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_active = true RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during product deletion'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [categoryId, parseInt(limit), offset]);

    res.json({
      success: true,
      data: { products: result.rows }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name ILIKE $1 OR p.description ILIKE $1 OR p.sku ILIKE $1) 
      AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `, [`%${q}%`, parseInt(limit), offset]);

    res.json({
      success: true,
      data: { products: result.rows }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const result = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $1
    `, [parseInt(limit)]);

    res.json({
      success: true,
      data: { products: result.rows }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts
}; 