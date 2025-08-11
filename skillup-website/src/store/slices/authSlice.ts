import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials, RegisterData, AuthResponse } from '../../types/index.js';
import { authApi } from '../../api/auth.js';

// Initial state
const initialState: AuthState = {
  user: authApi.getCurrentUser(),
  token: authApi.getToken(),
  isAuthenticated: authApi.isAuthenticated(),
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authApi.register(userData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

export const validateToken = createAsyncThunk<
  { valid: boolean; user?: User },
  void,
  { rejectValue: string }
>(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.validateToken();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Token validation failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authApi.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Validate token
    builder
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.valid && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          authApi.logout();
        }
      })
      .addCase(validateToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        authApi.logout();
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
