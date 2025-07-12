import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth/auth.service';

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const res = await authService.getCurrentUser();
    return res.data;
  }
);
