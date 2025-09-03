import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with search and filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: { 
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Single product fetch error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find({ category })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ overallRating: -1 });

    const total = await Product.countDocuments({ category });

    res.json({
      success: true,
      data: { 
        products,
        category,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total
        }
      }
    });
  } catch (error) {
    console.error('Category products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
});

// Get featured products (top rated)
router.get('/featured/top', async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ overallRating: -1, totalReviews: -1 })
      .limit(8);

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Featured products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

export default router;
// Create a new product (POST route)
router.post('/', async (req, res) => {
  try {
    const { name, description, category, brand, price, imageUrl, features } = req.body;
    
    // Validation
    if (!name || !description || !category || !brand || !price || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Create product
    const product = new Product({
      name,
      description,
      category,
      brand,
      price,
      imageUrl,
      features: features || []
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
    
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
});
