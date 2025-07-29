import { createSlice } from "@reduxjs/toolkit";
import { getMessagesByConversationId } from "./messageAsync";
const initialState = {
  messages: [],
  userSetting: null,
  isLoading: false,
  redirectAfterLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    //auth/me
    builder
      .addCase(getMessagesByConversationId.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(getMessagesByConversationId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessagesByConversationId.rejected, (state) => {
        state.messages = null;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
