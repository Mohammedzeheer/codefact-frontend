import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studioReducer from './slices/studioSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studio: studioReducer,
  },
});
