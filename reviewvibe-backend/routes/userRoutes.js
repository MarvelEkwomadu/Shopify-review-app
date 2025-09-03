import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          points: user.points,
          reviewCount: user.reviewCount,
          isVerified: user.isVerified,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};

    // Validate and add fields to update
    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long'
        });
      }
      updates.name = name.trim();
    }

    if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          points: user.points,
          reviewCount: user.reviewCount,
          isVerified: user.isVerified,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
});

// Get user points and activity summary
router.get('/points', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get recent reviews for activity
    const recentReviews = await Review.find({ user: req.user.id })
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate points breakdown
    const pointsFromReviews = recentReviews.reduce((total, review) => total + review.pointsEarned, 0);

    res.json({
      success: true,
      data: {
        totalPoints: user.points,
        reviewCount: user.reviewCount,
        pointsBreakdown: {
          fromReviews: pointsFromReviews
        },
        recentActivity: recentReviews.map(review => ({
          id: review._id,
          productName: review.product.name,
          rating: review.rating,
          pointsEarned: review.pointsEarned,
          date: review.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Points fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user points',
      error: error.message
    });
  }
});

// Get user's reviews with pagination
router.get('/reviews', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name image price category')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments({ user: req.user.id });

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
    console.error('User reviews fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user reviews',
      error: error.message
    });
  }
});

// Get user statistics and achievements
router.get('/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get review statistics
    const reviewStats = await Review.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalPointsEarned: { $sum: '$pointsEarned' },
          averageAiScore: { $avg: '$aiTrustScore' },
          reviewsWithMedia: { 
            $sum: { 
              $cond: [{ $ne: ['$mediaType', null] }, 1, 0] 
            }
          },
          videoReviews: { 
            $sum: { 
              $cond: [{ $eq: ['$mediaType', 'video'] }, 1, 0] 
            }
          },
          imageReviews: { 
            $sum: { 
              $cond: [{ $eq: ['$mediaType', 'image'] }, 1, 0] 
            }
          }
        }
      }
    ]);

    const stats = reviewStats[0] || {
      totalReviews: 0,
      averageRating: 0,
      totalPointsEarned: 0,
      averageAiScore: 0,
      reviewsWithMedia: 0,
      videoReviews: 0,
      imageReviews: 0
    };

    // Calculate achievements
    const achievements = [];
    
    if (stats.totalReviews >= 1) achievements.push({ name: 'First Review', description: 'Created your first review' });
    if (stats.totalReviews >= 10) achievements.push({ name: 'Reviewer', description: 'Created 10+ reviews' });
    if (stats.totalReviews >= 50) achievements.push({ name: 'Expert Reviewer', description: 'Created 50+ reviews' });
    if (stats.videoReviews >= 5) achievements.push({ name: 'Video Creator', description: 'Created 5+ video reviews' });
    if (stats.averageAiScore >= 8) achievements.push({ name: 'Trusted Voice', description: 'High AI trust score average' });
    if (user.points >= 1000) achievements.push({ name: 'Point Master', description: 'Earned 1000+ points' });

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          points: user.points,
          joinedDate: user.createdAt
        },
        reviewStats: {
          totalReviews: stats.totalReviews,
          averageRating: Math.round(stats.averageRating * 10) / 10,
          averageAiScore: Math.round(stats.averageAiScore * 10) / 10,
          reviewsWithMedia: stats.reviewsWithMedia,
          videoReviews: stats.videoReviews,
          imageReviews: stats.imageReviews
        },
        pointsStats: {
          totalPoints: user.points,
          totalPointsEarned: stats.totalPointsEarned,
          averagePointsPerReview: stats.totalReviews > 0 ? Math.round(stats.totalPointsEarned / stats.totalReviews) : 0
        },
        achievements
      }
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics',
      error: error.message
    });
  }
});

// Get user leaderboard position
router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    // Get top 10 users by points
    const topUsers = await User.find({})
      .select('name points reviewCount')
      .sort({ points: -1 })
      .limit(10);

    // Find current user's position
    const currentUserRank = await User.countDocuments({ 
      points: { $gt: req.user.points } 
    }) + 1;

    res.json({
      success: true,
      data: {
        topUsers: topUsers.map((user, index) => ({
          rank: index + 1,
          name: user.name,
          points: user.points,
          reviewCount: user.reviewCount,
          isCurrentUser: user._id.toString() === req.user.id.toString()
        })),
        currentUser: {
          rank: currentUserRank,
          points: req.user.points,
          reviewCount: req.user.reviewCount
        }
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation required'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Verify password
    const isMatch = await user.comparePassword(confirmPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete all user's reviews
    await Review.deleteMany({ user: req.user.id });
    
    // Delete user account
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

export default router;