import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
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
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    initialize: (state, action) => {
      state.token = action.payload.token;
      // Add logic to fetch user data if needed
    }
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;