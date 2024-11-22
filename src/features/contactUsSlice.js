import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const contactUsSlice = createSlice({
  name: 'contactUs',
  initialState,
  reducers: {
    updateContactFormData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetContactFormData: (state) => {
      return initialState;
    },
  },
});

export const { updateContactFormData, resetContactFormData } = contactUsSlice.actions;
export const selectContactUsData = (state) => state.contactUs;

export default contactUsSlice.reducer;
