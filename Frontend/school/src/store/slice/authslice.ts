// import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

// interface AuthState {
//   accessToken: string | null;
//   refreshToken: string | null;
//    user: unknown | null; 

// }

// const initialState: AuthState = {
//   accessToken: null,
//   refreshToken: null,
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       action: PayloadAction<{ accessToken: string; refreshToken: string; user?: unknown }>
//     ) => {
//       state.accessToken = action.payload.accessToken;
//       state.refreshToken = action.payload.refreshToken;
//       if (action.payload.user) state.user = action.payload.user;
//     },
//     logout: (state) => {
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.user = null;
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  otpToken: string | null; 
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  otpToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   setCredentials: (
  state,
  action: PayloadAction<{
    accessToken?: string | null;
    refreshToken?: string | null;
    otpToken?: string | null;
    user?: User | null;
  }>
) => {
  if (action.payload.accessToken !== undefined)
    state.accessToken = action.payload.accessToken;
  if (action.payload.refreshToken !== undefined)
    state.refreshToken = action.payload.refreshToken;
  if (action.payload.otpToken !== undefined)
    state.otpToken = action.payload.otpToken;
  if (action.payload.user !== undefined)
    state.user = action.payload.user;
},
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.otpToken = null; 
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
