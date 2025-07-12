import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser } from './authAsync';
import { loginHandle } from './loginAsync';
import { registerHandle } from './registerAsync';

const initialState = {
  currentUser: null,
  isLoading: false,
  isAuth: false,
  component: 'optionalLogin',
  dataRegister: {},
  dataLogin: {},
  redirectAfterLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setComponent: (state, action) => {
      state.component = action.payload;
    },
    setRegister: (state, action) => {
      state.dataRegister = action.payload;
    },
    setLogin: (state, action) => {
      state.dataLogin = action.payload;
    },
    setRedirectAfterLogin: (state, action) => {
      state.redirectAfterLogin = action.payload;
    },
  },
  extraReducers: (builder) => {
    //auth/me
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
        state.isAuth = true;
        state.redirectAfterLogin = true;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.currentUser = null;
        state.isLoading = false;
        state.isAuth = false;
        state.redirectAfterLogin = false;
      });

    //auth/login
    builder
      .addCase(loginHandle.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
        state.isAuth = true;
        state.redirectAfterLogin = true;
      })
      .addCase(loginHandle.pending, (state) => {
        state.isLoading = true;
        state.isAuth = false;
        state.redirectAfterLogin = false;
      })
      .addCase(loginHandle.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.redirectAfterLogin = false;
      });

    //auth/register
    builder
      .addCase(registerHandle.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(registerHandle.pending, (state) => {
        state.currentUser = null;
        state.isLoading = true;
        state.isAuth = false;
      })
      .addCase(registerHandle.rejected, (state) => {
        state.currentUser = null;
        state.isLoading = false;
        state.isAuth = false;
      });
  },
});

export const { setComponent, setRegister, setLogin, setRedirectAfterLogin } =
  authSlice.actions;
export default authSlice.reducer;
