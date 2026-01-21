import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  fullname: string;
  role: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

interface SetAuthPayload {
  user: User;
  token: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: () => initialState,
  },
});

export const { setAuth, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
