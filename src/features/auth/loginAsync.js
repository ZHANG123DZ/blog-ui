//Kho chứa các hàm bất đồng bộ
import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth/auth.service';

export const loginHandle = createAsyncThunk('auth/login', async (payload) => {
  const res = await authService.login(payload);
  return res.data;
});
