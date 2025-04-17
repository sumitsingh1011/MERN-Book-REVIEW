import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import usersReducer from '../features/users/usersSlice';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/search/searchSlice';


// Change this from default export to named export
export const store = configureStore({
  reducer: {
    books: booksReducer,
    reviews: reviewsReducer,
    users: usersReducer,
    auth: authReducer,
    search: searchReducer,

  },
});