const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// GET reviews for a specific book
router.get('/', async (req, res) => {
  try {
    const bookId = req.query.bookId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!bookId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Book ID is required' 
      });
    }

    // Verify if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false, 
        message: 'Book not found' 
      });
    }

    // Get reviews with pagination
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalReviews = await Review.countDocuments({ book: bookId });

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasMore: skip + reviews.length < totalReviews
        },
        averageRating: avgRating.length > 0 ? avgRating[0].average : 0
      }
    });

  } catch (err) {
    console.error('Error in GET /reviews:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid book ID format' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving reviews', 
      error: err.message 
    });
  }
});

// POST a new review
router.post('/', [
  body('bookId')
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Invalid book ID format'),
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format'),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 3, max: 1000 }).withMessage('Comment must be between 3 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { bookId, userId, rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    // Create and save the review
    const review = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
      createdAt: new Date()
    });

    const savedReview = await review.save();

    // Update book's reviews array and recalculate average rating
    book.reviews.push(savedReview._id);
    const bookReviews = await Review.find({ book: bookId });
    const avgRating = bookReviews.reduce((acc, curr) => acc + curr.rating, 0) / bookReviews.length;
    book.averageRating = avgRating;
    await book.save();

    // Update user's reviews array
    user.reviews.push(savedReview._id);
    await user.save();

    // Return populated review
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'username')
      .populate('book', 'title');

    res.status(201).json({
      success: true,
      data: populatedReview
    });

  } catch (err) {
    console.error('Error in POST /reviews:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: err.message
    });
  }
});

// DELETE a review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Remove review from book's reviews array
    await Book.findByIdAndUpdate(review.book, {
      $pull: { reviews: reviewId }
    });

    // Remove review from user's reviews array
    await User.findByIdAndUpdate(review.user, {
      $pull: { reviews: reviewId }
    });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (err) {
    console.error('Error in DELETE /reviews:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: err.message
    });
  }
});

module.exports = router;