import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFormData: (state) => {
      return initialState;
    },
  },
});

export const { updateFormData, resetFormData } = signupSlice.actions;
export const selectSignupData = (state) => state.signup;

export default signupSlice.reducer;
