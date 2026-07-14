import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      // Handle both formats: dispatch(login({ userData })) and dispatch(login(userData))
      const rawUserData = action.payload && action.payload.userData !== undefined 
        ? action.payload.userData 
        : action.payload;
      
      // Serialize to remove non-serializable functions/properties from Appwrite SDK
      state.userData = rawUserData ? JSON.parse(JSON.stringify(rawUserData)) : null;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
