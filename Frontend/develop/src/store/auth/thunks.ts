import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import type { LoginPayload, SignupPayload } from "./types";

export const checkAuth = createAsyncThunk<
  { id: number; email: string; name: string; role: string },
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.detail ?? "Token verification failed",
    );
  }
});

export const login = createAsyncThunk<
  { access_token: string; username: string; role: string; id: number },
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.post("/login", null, {
      params: { email, password },
    });
    localStorage.setItem("token", response.data.access_token);
    dispatch(checkAuth());
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail ?? "Login failed");
  }
});

export const adminLogin = createAsyncThunk<
  { access_token: string; username: string; role: string; id: number },
  LoginPayload,
  { rejectValue: string }
>("auth/adminLogin", async ({ email, password }, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.post("/admin/login", null, {
      params: { email, password },
    });
    localStorage.setItem("token", response.data.access_token);
    dispatch(checkAuth());
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail ?? "Admin Login failed");
  }
});

export const signup = createAsyncThunk<
  void,
  SignupPayload,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/signup", null, {
      params: payload,
    });
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail ?? "Signup failed");
  }
});
