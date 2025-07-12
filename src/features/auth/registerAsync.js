import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth/auth.service';

export const registerHandle = createAsyncThunk(
  'auth/register',
  async (payload) => {
    const res = await authService.register(payload);
    return res.data;
  }
);
