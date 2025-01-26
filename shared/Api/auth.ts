import apiClient from "./ApiClient"; // Import the Axios instance
import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTERED_SUCCESS,
  REGISTERED_FAILURE,
  REGISTERED_INIT,
  LOGIN_INIT,
  FORGET_INIT,
  FORGET_SUCCESS,
  FORGET_FAILURE,
  OTP_INIT,
  OTP_SUCCESS,
  OTP_FAILURE,
  RESET_SUCCESS,
  RESET_FAILURE,
  RESET_INIT,
  EDIT_PROFILE_FAILURE,
  EDIT_PROFILE_INIT,
  EDIT_PROFILE_SUCCESS,
  DELETE_PROFILE_INIT,
  DELETE_PROFILE_SUCCESS,
  DELETE_PROFILE_FAILURE,
  GET_GLOBAL_USER_INIT,
  GET_GLOBAL_USER_SUCCESS,
  GET_GLOBAL_USER_FAILURE,
} from "../redux/types";

export const signIn = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: LOGIN_INIT });
    const response = await apiClient.post("/auth/Sign-in", data);

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    }
    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

// Your signUp thunk action
export const signUp = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: REGISTERED_INIT });
    const response = await apiClient.post("/auth/Sign-Up", data);
    if (response.status === 200) {
      dispatch({ type: REGISTERED_SUCCESS, payload: response.data });

      return response;
    }
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: REGISTERED_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: REGISTERED_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const ForgotPassword = async (email: any, dispatch: any) => {
  try {
    dispatch({ type: FORGET_INIT });
    const response = await apiClient.post("/auth/forgot-password", {
      email: email,
    });
    if (response.status === 200) {
      dispatch({ type: FORGET_SUCCESS, payload: response.data });
      return response;
    }
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: FORGET_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: FORGET_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const VerifyOtp = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: OTP_INIT });
    const response = await apiClient.post("/auth/verify-otp", data);
    if (response.status === 200) {
      dispatch({ type: OTP_SUCCESS, payload: response.data });
      return response;
    }
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: OTP_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: OTP_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const ResetPassword = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: RESET_INIT });
    const response = await apiClient.post("/auth/reset-password", data);
    if (response.status === 200) {
      dispatch({ type: RESET_SUCCESS, payload: response.data });
      return response;
    }
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: RESET_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: RESET_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const editProfile = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: EDIT_PROFILE_INIT });
    const response = await apiClient.post("/auth/edit-profile", data);
    if (response.status === 200) {
      dispatch({ type: EDIT_PROFILE_SUCCESS, payload: response.data });
      return response;
    }
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: EDIT_PROFILE_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: EDIT_PROFILE_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const deleteProfile = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: DELETE_PROFILE_INIT });
    const response = await apiClient.delete("/auth/delete-user", {
      params: { id: data?.id },
    });
    if (response.status === 200) {
      dispatch({ type: DELETE_PROFILE_SUCCESS, payload: response.data });
      return response;
    }
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: DELETE_PROFILE_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: DELETE_PROFILE_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getGlobalUser = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: GET_GLOBAL_USER_INIT });
    const response = await apiClient.get("/auth/get-global-user", {
      params: {
        page: data?.page || 1,
        limit: data?.limit || 10,
        skipPages: data?.skipPages || [],
      },
    });

    if (response.status === 200) {
      dispatch({ type: GET_GLOBAL_USER_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_GLOBAL_USER_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_GLOBAL_USER_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const banUser = async (data: any) => {
  // console.log("data::::::::      ",data)
  try {
    const response = await apiClient.post(
      "/auth/ban-user",
      {
        userId: data.userId,
        isBanned: data.isBanned,
        banReason: data.banReason,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error("Error banning user:", error.response?.data || error.message);
    throw error;
  }
};
