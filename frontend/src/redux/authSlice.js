import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axiosConfig";

/* 🔐 LOGIN ASYNC THUNK */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      console.log("🔐 Attempting login with credentials:", { username: credentials.username });

      const res = await api.post("/user/login", credentials);

      console.log("✅ Login successful, response:", res.data);
      return res.data; // user object from backend with token
    } catch (err) {
      console.error("❌ Login failed:", err);
      return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

/* 🔍 CHECK AUTH ASYNC THUNK (Restore session from storage) */
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      console.log("🔍 Checking authentication status from storage...");
      const savedState = localStorage.getItem('authState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed?.token && parsed?.tokenExpiry && Date.now() < parsed.tokenExpiry) {
          console.log("✅ Session valid and restored:", parsed);
          return parsed;
        } else {
          console.warn("⚠️ Token expired or invalid in storage");
          localStorage.removeItem('authState');
        }
      }
      return thunkAPI.rejectWithValue("No valid session");
    } catch (err) {
      console.warn("⚠️ Error checking auth session:", err);
      return thunkAPI.rejectWithValue("No session");
    }
  }
);

/* 🚪 LOGOUT ASYNC THUNK */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      console.log("🚪 Logging out from server...");
      await api.post("/user/logout");
      console.log("✅ Server session cleared");
      return true;
    } catch (err) {
      console.error("❌ Logout request failed:", err);
      return true;
    }
  }
);

const loadInitialAuthState = () => {
  try {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed?.token && parsed?.tokenExpiry && Date.now() < parsed.tokenExpiry) {
        return {
          user: parsed.user,
          token: parsed.token,
          tokenExpiry: parsed.tokenExpiry,
          isAuthenticated: true,
          role: parsed.role,
          loading: false,
          error: null
        };
      }
    }
  } catch (e) {
    console.error("Error reading initial authState from localStorage", e);
  }
  return {
    user: null,
    token: null,
    tokenExpiry: null,
    isAuthenticated: false,
    role: null,
    loading: false,
    error: null
  };
};

const initialAuthState = loadInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    /* 🔄 RESTORE USER FROM localStorage */
    setUserFromStorage: (state, action) => {
      console.log("🔄 Restoring user from storage:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },

    /* 🚪 LOGOUT (Local State Only) */
    logout: (state) => {
      console.log("🚪 Logging out user (local)");
      localStorage.removeItem('authState');
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.role = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* ⏳ LOGIN START */
      .addCase(login.pending, (state) => {
        console.log("⏳ Login pending...");
        state.loading = true;
        state.error = null;
      })

      /* ✅ LOGIN SUCCESS */
      .addCase(login.fulfilled, (state, action) => {
        console.log("✅ Login fulfilled with data:", action.payload);
        console.log("📦 Full action.payload:", JSON.stringify(action.payload, null, 2));

        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.tokenExpiry = Date.now() + action.payload.expiresIn;
        state.role = action.payload.role;
        state.isAuthenticated = true;

        console.log("🔐 Redux state after update:");
        console.log("  - isAuthenticated:", state.isAuthenticated);
        console.log("  - role:", state.role);
        console.log("  - loading:", state.loading);
        console.log("  - token:", state.token ? "SET" : "NOT SET");

        // Save to localStorage
        try {
          const authData = {
            user: action.payload,
            token: action.payload.token,
            tokenExpiry: Date.now() + action.payload.expiresIn,
            role: action.payload.role,
            isAuthenticated: true
          };
          localStorage.setItem('authState', JSON.stringify(authData));
          console.log("✅ User data persisted to localStorage");
          console.log("🔑 JWT Token:", action.payload.token);
          console.log("⏰ Token expires at:", new Date(Date.now() + action.payload.expiresIn).toLocaleString());

          // Verify it was actually saved
          const saved = localStorage.getItem('authState');
          console.log("✅ Verified localStorage save:", saved ? "SUCCESS" : "FAILED");
        } catch (error) {
          console.error("❌ Error saving to localStorage:", error);
          console.error("❌ This might be due to SES or browser restrictions");
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ⏳ CHECK AUTH START */
      .addCase(checkAuth.pending, (state) => {
        if (!state.isAuthenticated) {
          state.loading = true;
        }
      })

      /* ✅ CHECK AUTH SUCCESS */
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
        state.tokenExpiry = action.payload.tokenExpiry;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })

      /* ❌ CHECK AUTH FAILED */
      .addCase(checkAuth.rejected, (state) => {
        localStorage.removeItem('authState');
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.tokenExpiry = null;
        state.role = null;
      })

      /* ⏳ LOGOUT USER START */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      /* ✅ LOGOUT USER SUCCESS */
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem('authState');
        state.loading = false;
        state.user = null;
        state.token = null;
        state.tokenExpiry = null;
        state.isAuthenticated = false;
        state.role = null;
      })

      /* ❌ LOGOUT USER FAILED */
      .addCase(logoutUser.rejected, (state) => {
        localStorage.removeItem('authState');
        state.loading = false;
        state.user = null;
        state.token = null;
        state.tokenExpiry = null;
        state.isAuthenticated = false;
        state.role = null;
      });
  }
});

export const { setUserFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;
