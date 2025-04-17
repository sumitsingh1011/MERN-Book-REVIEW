import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';  // Assuming you have axios setup for your API

// Async action to fetch the user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,  // Add the token to the request
        },
      });
      return response.data; // Assuming response.data contains user profile
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        _id: action.payload._id,
        username: action.payload.username,
        email: action.payload.email,
        avatar: action.payload.avatar,
      };
      state.isAuthenticated = true;
      state.token = action.payload.token; // Save the token as well
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    initialize: (state, action) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;  // Set the fetched user profile
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout, initialize } = authSlice.actions;
export default authSlice.reducer;
