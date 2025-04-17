// components/ReviewForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {  resetAddReviewStatus } from '../features/reviews/reviewsSlice';

const ReviewForm = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { status, error } = useSelector((state) => state.reviews);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState(null);

  // Reset form and status when unmounting
  useEffect(() => {
    return () => {
      dispatch(resetAddReviewStatus());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation checks
    if (!user) {
      setSubmitError('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      setSubmitError('Please enter a comment');
      return;
    }

    if (comment.trim().length < 3) {
      setSubmitError('Comment must be at least 3 characters long');
      return;
    }

    try {
      const reviewData = {
        bookId,
        userId: user.id,
        rating: Number(rating),
        comment: comment.trim()
      };

      // Make direct API call instead of using Redux
      const response = await axios.post('http://localhost:5100/api/reviews', reviewData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setComment('');
        setRating(5);
        setSubmitError(null);
        // Optional: Add success message or callback
      } else {
        setSubmitError(response.data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || 'Failed to submit review';
      
      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Submit a Review</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            disabled={status === 'loading'}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={status === 'loading'}
            rows="4"
            placeholder="Share your thoughts about this book..."
            required
            minLength="3"
            maxLength="1000"
          />
          <small className="text-muted">
            {comment.length}/1000 characters
          </small>
        </div>

        {(error || submitError) && (
          <div className="alert alert-danger" role="alert">
            {error || submitError}
          </div>
        )}

        {status === 'succeeded' && (
          <div className="alert alert-success" role="alert">
            Review submitted successfully!
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;