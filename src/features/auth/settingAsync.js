import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth/auth.service";

export const settingHandle = createAsyncThunk(
  "auth/setting",
  async (payload) => {
    const res = await authService.userSetting(payload);
    return res.data;
  }
);
