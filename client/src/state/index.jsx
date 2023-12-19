import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: {
    username: null,
    picture: null,
    firstName: null,
    lastName: null,
    email: null,
  },
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      if (state.user) {
        state.user.username = action.payload.user.username;
        state.user.picture = action.payload.user.picture;
      } else {
        state.user = {
          username: action.payload.user.username,
          picture: action.payload.user.picture,
        };
      }
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = initialState.user;
      state.token = null;
    },
    updateUser: (state, action) => {
      // Update user information with the provided data
      const { firstName, lastName, email, picture } = action.payload;
      if (state.user) {
        state.user.firstName = firstName;
        state.user.lastName = lastName;
        state.user.email = email;
        state.user.picture = picture;
      }
    },
    setUser: (state, action) => {
      // Replace the current user state with the payload
      state.user = action.payload;
    },
  },
});

export const { setLogin, setLogout, updateUser, setUser } = authSlice.actions;

export default authSlice.reducer;
