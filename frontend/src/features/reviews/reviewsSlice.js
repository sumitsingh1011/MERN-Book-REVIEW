// features/reviews/reviewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 👉 Thunk to fetch reviews
 const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5100/reviews/${bookId}`);

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch reviews'
      );
    }
  }
);

// 👉 Thunk to add a review
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5100/reviews', reviewData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to submit review'
      );
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    status: 'idle',
    error: null
  },
  reducers: {
    resetAddReviewStatus: (state) => {
      state.status = 'idle';
      state.error = null;
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
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews.unshift(action.payload);
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetAddReviewStatus } = reviewsSlice.actions;
export { fetchReviews }; // ✅ Now it exists and is exported!
export default reviewsSlice.reducer;
