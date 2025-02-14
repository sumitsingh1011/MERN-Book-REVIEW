// features/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action to fetch user profile
export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await axios.get(`http://localhost:5100/api/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: null,
    status: 'idle',
    error: null
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearUserError } = usersSlice.actions;
export default usersSlice.reducer;