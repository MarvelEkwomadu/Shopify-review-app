import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

    // Build sort criteria
    let sortCriteria = { createdAt: -1 }; // newest first by default
    if (sortBy === 'oldest') sortCriteria = { createdAt: 1 };
    if (sortBy === 'rating-high') sortCriteria = { rating: -1 };
    if (sortBy === 'rating-low') sortCriteria = { rating: 1 };
    if (sortBy === 'helpful') sortCriteria = { helpfulVotes: -1 };

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments({ product: productId });

    res.json({
      success: true,
      data: { 
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get reviews by a specific user
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    // Only allow users to see their own reviews or make this admin-only
    if (req.params.userId !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own reviews.'
      });
    }

    const reviews = await Review.find({ user: req.params.userId })
      .populate('product', 'name image price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    console.error('User reviews fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
});

// Create a new review
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, text, title, mediaType, mediaUrl } = req.body;

    // Validation
    if (!productId || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating, and text are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product. You can update your existing review instead.'
      });
    }

    // Create the review
    const review = new Review({
      user: req.user.id,
      product: productId,
      rating: parseInt(rating),
      comment: text.trim(),
      title: title ? title.trim() : null,
      mediaType: mediaType || null,
      mediaUrl: mediaUrl || null
    });

    // Save the review (triggers pre-save middleware for AI score and points)
    await review.save();

    // Update user points and review count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 
        points: review.pointsEarned,
        reviewCount: 1
      }
    });

    // Recalculate product stats
    await updateProductStats(productId);

    // Populate user info for response
    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { 
        review,
        pointsEarned: review.pointsEarned
      }
    });
  } catch (error) {
    console.error('Review creation error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create review'
    });
  }
});

// Update an existing review
router.put('/:reviewId', authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text, title, mediaType, mediaUrl } = req.body;

    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own reviews.'
      });
    }

    // Update fields
    if (rating) review.rating = parseInt(rating);
    if (text) review.text = text.trim();
    if (title !== undefined) review.title = title ? title.trim() : null;
    if (mediaType !== undefined) review.mediaType = mediaType;
    if (mediaUrl !== undefined) review.mediaUrl = mediaUrl;

    // Recalculate AI score and points
    review.calculateAiTrustScore();
    review.calculatePointsEarned();

    await review.save();

    // Update product stats
    await updateProductStats(review.product);

    await review.populate('user', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Review update error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update review'
    });
  }
});

// Delete a review
router.delete('/:reviewId', authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own reviews.'
      });
    }

    const productId = review.product;
    const pointsToDeduct = review.pointsEarned;

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 
        points: -pointsToDeduct,
        reviewCount: -1
      }
    });

    // Update product stats
    await updateProductStats(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Review deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Marked as helpful',
      data: { review }
    });
  } catch (error) {
    console.error('Helpful vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful'
    });
  }
});

// Helper function to update product statistics
async function updateProductStats(productId) {
  try {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        overallRating: 0,
        totalReviews: 0,
        aiTrustScore: 0
      });
      return;
    }

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const avgAiScore = reviews.reduce((sum, review) => sum + review.aiTrustScore, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      overallRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      aiTrustScore: Math.round(avgAiScore * 10) / 10
    });
  } catch (error) {
    console.error('Error updating product stats:', error);
  }
}

export default router;