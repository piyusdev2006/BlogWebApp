import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: null,     // Appwrite account object (name, email, $id, $createdAt …)
  profile: null,      // Profile doc from DB (displayName, username, bio, avatarFileId, socials, role)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      const rawUserData =
        action.payload && action.payload.userData !== undefined
          ? action.payload.userData
          : action.payload;
      state.userData = rawUserData
        ? JSON.parse(JSON.stringify(rawUserData))
        : null;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.profile = null;
    },

    /**
     * Store / refresh the user's profile document from the database.
     */
    setProfile: (state, action) => {
      state.profile = action.payload
        ? JSON.parse(JSON.stringify(action.payload))
        : null;
    },
  },
});

export const { login, logout, setProfile } = authSlice.actions;

export default authSlice.reducer;
