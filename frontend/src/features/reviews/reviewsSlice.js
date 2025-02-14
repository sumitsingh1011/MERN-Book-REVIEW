import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5100';

// Helper function to normalize reviews data
const normalizeReviewsData = (data) => {
  if (Array.isArray(data)) return data;
  if (data.reviews) return data.reviews;
  if (data.data) return data.data;
  return [];
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/reviews?bookId=${bookId}`);
      console.log('Raw API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/reviews', reviewData);
      return response.data; // Ensure this is the review object, not a wrapper object
    } catch (err) {
      return rejectWithValue(err.response.data); // Handle errors
    }
  }
);
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    status: 'idle',
    error: null,
    addReviewStatus: 'idle',
    addReviewError: null
  },
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    resetAddReviewStatus: (state) => {
      state.addReviewStatus = 'idle';
      state.addReviewError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = normalizeReviewsData(action.payload);
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch reviews';
      })
      .addCase(addReview.pending, (state) => {
        state.addReviewStatus = 'loading';
        state.addReviewError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.addReviewStatus = 'succeeded';
        const newReview = action.payload.review || action.payload;
        state.reviews = [...state.reviews, newReview];
      })
      .addCase(addReview.rejected, (state, action) => {
        state.addReviewStatus = 'failed';
        state.addReviewError = action.payload || 'Failed to add review';
      });
  },
});

export const { resetStatus, resetAddReviewStatus } = reviewsSlice.actions;
export default reviewsSlice.reducer;