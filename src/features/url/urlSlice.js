import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  link: location.pathname + location.search,
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    nextUrl: (state, action) => {
      state.link = action.payload;
    },
    clearUrl: (state) => {
      state.link = null;
    },
  },
});

export const { nextUrl, clearUrl } = urlSlice.actions;
export default urlSlice.reducer;
