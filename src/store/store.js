//Kho chứa các slide Redux

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

import authReducer from '../features/auth/authSlice';
import urlReducer from '../features/url/urlSlice';

const authConfig = {
  key: 'auth',
  storage,
  whitelist: [
    'isAuth',
    'isLoading',
    'currentUser',
    'component',
    'redirectAfterLogin',
  ],
};

const urlConfig = {
  key: 'url',
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  url: persistReducer(urlConfig, urlReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});

export const persistor = persistStore(store);
export default store;
