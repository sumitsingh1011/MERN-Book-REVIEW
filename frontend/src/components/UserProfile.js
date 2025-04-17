
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Spinner } from 'react-bootstrap';
import { fetchUserProfile } from '../features/auth/authSlice'; // Example action to fetch user data

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth); // Assuming the auth state has these
  const { reviews } = user || {}; // Default to empty if user doesn't exist

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile()); // Fetch user data if not already available
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="container mt-5 pt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5 pt-4">
        <Alert variant="warning">
          Please log in to view your profile.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-4">
      <div className="card">
        <div className="card-header bg-light">
          <div className="d-flex align-items-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="rounded-circle me-3 bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: '60px', height: '60px', fontSize: '24px' }}
              >
                {user.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="mb-0">{user.username}</h4>
              <small className="text-muted">Member since {new Date(user.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-4">Profile Information</h5>
              <div className="mb-3">
                <label className="text-muted">Username</label>
                <p className="mb-0">{user.username}</p>
              </div>
              <div className="mb-3">
                <label className="text-muted">Email</label>
                <p className="mb-0">{user.email}</p>
              </div>
            </div>
            
            <div className="col-md-6">
              <h5 className="mb-4">Activity</h5>
              <div className="mb-3">
                <label className="text-muted">Reviews</label>
                <p className="mb-0">{reviews?.length || 0} reviews written</p>
              </div>
              <div className="mb-3">
                <label className="text-muted">Last Login</label>
                <p className="mb-0">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {reviews && reviews.length > 0 && (
            <div className="mt-4">
              <h5 className="mb-4">Recent Reviews</h5>
              <div className="list-group">
                {reviews.slice(0, 5).map(review => (
                  <div key={review._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-1">{review.book?.title}</h6>
                      <span className="badge bg-primary">★ {review.rating}</span>
                    </div>
                    <p className="mb-1">{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
