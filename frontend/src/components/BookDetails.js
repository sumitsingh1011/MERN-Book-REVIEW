import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../features/reviews/reviewsSlice';
import ReviewForm from './ReviewForm';


const BookDetails = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  
  // Get reviews state from Redux
  const {
    reviews: reviewsData,
    status,
    error,
    addReviewStatus,
    addReviewError
  } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (bookId) {
      console.log('Fetching reviews for bookId:', bookId);
      dispatch(fetchReviews(bookId));
    }
  }, [dispatch, bookId]);

  // Debug log to check the reviews data structure
  console.log('Reviews data:', reviewsData);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Loading reviews...</div>
      </div>
    );
  }

  // Error state
  if (status === 'failed') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Error: {error}
        </div>
      </div>
    );
  }

  // Extract reviews array from the response
  const reviews = Array.isArray(reviewsData) 
    ? reviewsData 
    : (reviewsData?.reviews || reviewsData?.data || []);

  // No reviews state
  if (!reviews || reviews.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          No reviews available for this book yet.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
        <div className="container mt-4">
      {/* Book details and reviews */}
      <ReviewForm />
    </div>
      <h2>Reviews</h2>
      <div className="row">
        {reviews.map((review) => (
          <div key={review._id || review.id} className="col-12 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">
                    Rating: {review.rating || 'N/A'}/5
                  </h5>
                  <small className="text-muted">
                    By {review.user?.username || 'Anonymous'}
                  </small>
                </div>
                <p className="card-text">{review.comment || 'No comment provided'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show add review status messages if any */}
      {addReviewStatus === 'loading' && (
        <div className="alert alert-info">Adding your review...</div>
      )}
      {addReviewStatus === 'failed' && (
        <div className="alert alert-danger">
          Failed to add review: {addReviewError}
        </div>
      )}
      {addReviewStatus === 'succeeded' && (
        <div className="alert alert-success">
          Review added successfully!
        </div>
      )}
    </div>
  );
};

export default BookDetails;