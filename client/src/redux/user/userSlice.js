import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    singInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    singInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    singInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUsersuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart:(state) => {
      state.loading = true;
    },
    deleteUserSuccess:(state) =>{
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure:(state,action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const {
  singInStart,
  singInSuccess,
  singInFailure,
  updateUserStart,
  updateUsersuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} = userSlice.actions;
export default userSlice.reducer;
