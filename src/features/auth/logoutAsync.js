import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth/auth.service";

export const logoutHandle = createAsyncThunk("auth/logout", async (payload) => {
  const res = await authService.logout(payload);
  return res.data;
});
