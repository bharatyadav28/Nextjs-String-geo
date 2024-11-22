"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import signupReducer from "./features/signupSlice";
import authReducer from "./features/authSlice";
import { api } from "./features/api";
import loadingReducer from "./features/loadingSlice";
import contactUsReducer from "./features/contactUsSlice";

const rootReducer = combineReducers({
  user: userReducer,
  signup: signupReducer,
  contactUs: contactUsReducer,
  auth: authReducer,
  loading: loadingReducer,
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  });
};

export default store;
