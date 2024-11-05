import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    role: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

// Login user
export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            nip: user.nip,
            password: user.password
        });

        if (response.data.role === 'admin' || response.data.role === 'dosen') {
            return response.data; 
        } else {
            return thunkAPI.rejectWithValue("Role tidak valid");
        }
    } catch (error) {
        const message = error.response?.data?.msg || "Login failed";
        return thunkAPI.rejectWithValue(message);
    }
});

// Get current user info
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/me', { withCredentials: true });
        if (response.data.role === 'admin' || response.data.role === 'dosen') {
            return response.data;  
        } else {
            return thunkAPI.rejectWithValue("Role tidak valid");
        }
    } catch (error) {
        const message = error.response?.data?.msg || "Failed to fetch user info";
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout user
export const LogOut = createAsyncThunk("user/LogOut", async () => {
    await axios.delete('http://localhost:5000/logout', { withCredentials: true });
});

// Auth slice configuration
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
            state.role = action.payload.role;
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
        
        builder.addCase(LogOut.fulfilled, (state) => {
            state.user = null;
            state.role = null;
            state.isSuccess = false;
            state.isError = false;
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;