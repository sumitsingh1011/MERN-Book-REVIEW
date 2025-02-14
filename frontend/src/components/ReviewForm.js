// components/ReviewForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addReview } from '../features/reviews/reviewsSlice';

const ReviewForm = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get current user from auth state
  const { status, error } = useSelector((state) => state.reviews);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setSubmitError('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      setSubmitError('Please enter a comment');
      return;
    }

    const reviewData = {
      bookId,
      userId: user.id,
      rating: Number(rating),
      comment: comment.trim()
    };

    try {
      await dispatch(addReview(reviewData)).unwrap();
      setComment(''); // Clear form on success
      setRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setSubmitError(err.message || 'Failed to submit review');
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
          />
        </div>

        {(error || submitError) && (
          <div className="alert alert-danger" role="alert">
            {error || submitError}
          </div>
        )}

        {status === 'loading' && (
          <div className="alert alert-info" role="alert">
            Submitting review...
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;