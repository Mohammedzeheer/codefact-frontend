import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {mainApi} from '../../api/axios';

export const login = createAsyncThunk(
  'api/users/login',
  async (credentials) => {
    const response = await mainApi.post('/api/users/login', credentials);
    console.log(response)
    return response.data;
  }
);

export const signup = createAsyncThunk(
  'api/signup',
  async (userData) => {
    const response = await mainApi.post('/api/users/signup', userData);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('accessToken'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;