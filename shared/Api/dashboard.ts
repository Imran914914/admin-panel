import apiClient from "./ApiClient"; // Import the Axios instance

import {
  GET_COUNT_INIT,
  GET_COUNT_SUCCESS,
  GET_COUNT_FAILURE,
  GET_LOGINATTEMPT_FAILURE,
  GET_LOGINATTEMPT_SUCCESS,
  GET_LOGINATTEMPT_INIT,
  CREATE_POST_INIT,
  CREATE_POST_FAILURE,
  CREATE_POST_SUCCESS,
  CREATE_URL_INIT,
  CREATE_URL_FAILURE,
  CREATE_URL_SUCCESS,
  GET_URLS_INIT,
  GET_URLS_SUCCESS,
  GET_URLS_FAILURE,
  GET_URL_INIT,
  GET_URL_SUCCESS,
  GET_URL_FAILURE,
  UPDATE_URL_INIT,
  UPDATE_URL_SUCCESS,
  UPDATE_URL_FAILURE,
  DELETE_URL_INIT,
  DELETE_URL_SUCCESS,
  DELETE_URL_FAILURE,
  GET_POST_INIT,
  GET_POST_SUCCESS,
  GET_POST_FAILURE,
  GET_POSTS_INIT,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAILURE,
  UPDATE_POST_INIT,
  UPDATE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  DELETE_POST_INIT,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  GET_ACCOUNTS_INIT,
  GET_ACCOUNTS_SUCCESS,
  GET_ACCOUNTS_FAILURE,
  GET_NOTIFICATIONS_FAILURE,
  GET_NOTIFICATIONS_INIT,
  GET_NOTIFICATIONS_SUCCESS,
  DELETE_NOTIFICATIONS_INIT,
  DELETE_NOTIFICATIONS_SUCCESS,
  DELETE_NOTIFICATIONS_FAILURE,
  CLEAR_NOTIFICATIONS_INIT,
  CLEAR_NOTIFICATIONS_SUCCESS,
  CLEAR_NOTIFICATIONS_FAILURE,
  DELETE_ACCOUNTS_INIT,
  DELETE_ACCOUNTS_FAILURE,
  DELETE_ACCOUNTS_SUCCESS,
  CREATE_IP_FAILURE,
  CREATE_IP_INIT,
  CREATE_IP_SUCCESS,
  DELETE_IP_FAILURE,
  DELETE_IP_INIT,
  DELETE_IP_SUCCESS,
  GET_IP_FAILURE,
  GET_IP_INIT,
  GET_IP_SUCCESS,
  GET_TOPUSER_INIT,
  GET_TOPUSER_SUCCESS,
  GET_TOPUSER_FAILURE,
  GET_TODAY_COUNT_INIT,
  GET_TODAY_COUNT_SUCCESS,
  GET_TODAY_COUNT_FAILURE,
  GET_ACCOUNT_STATISTICS_INIT,
  GET_ACCOUNT_STATISTICS_SUCCESS,
  GET_ACCOUNT_STATISTICS_FAILURE,
  GET_GLOBAL_LOGINATTEMPT_INIT,
  GET_GLOBAL_LOGINATTEMPT_SUCCESS,
  GET_GLOBAL_LOGINATTEMPT_FAILURE,
  CREATE_SUBSCRIPTION_INIT,
  CREATE_SUBSCRIPTION_SUCCESS,
  CREATE_SUBSCRIPTION_FAILURE,
  CREATE_SUBSCRIPTIONHISTORY_INIT,
  CREATE_SUBSCRIPTIONHISTORY_SUCCESS,
  CREATE_SUBSCRIPTIONHISTORY_FAILURE,
  GET_SUBSCRIPTIONHISTORY_INIT,
  GET_SUBSCRIPTIONHISTORY_SUCCESS,
  GET_SUBSCRIPTIONHISTORY_FAILURE,
  GET_SUBSCRIPTION_INIT,
  GET_SUBSCRIPTION_SUCCESS,
  GET_SUBSCRIPTION_FAILURE,
  GET_ADMINSUBSCRIPTIONHISTORY_INIT,
  GET_ADMINSUBSCRIPTIONHISTORY_SUCCESS,
  GET_ADMINSUBSCRIPTIONHISTORY_FAILURE,
} from "../redux/types";

export const getAlluserCount = async (dispatch: any) => {
  try {
    dispatch({ type: GET_COUNT_INIT });
    const response = await apiClient.get("/dashboard/getAllUser");

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_COUNT_SUCCESS, payload: response.data });
    }
    return response?.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_COUNT_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_COUNT_FAILURE,
        payload: error.message,
      });
      // return error.message;
    }
  }
};
export const getTodayuserCount = async (dispatch: any) => {
  try {
    dispatch({ type: GET_TODAY_COUNT_INIT });
    const response = await apiClient.get("/dashboard/getTodayUsers");

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_TODAY_COUNT_SUCCESS, payload: response.data });
    }
    return response?.data?.TotalUser;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_TODAY_COUNT_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Counts failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_TODAY_COUNT_FAILURE,
        payload: error.message,
      });
      // return error.message;
    }
  }
};

export const createReview = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: "CREATE_REVIEW_INIT" }); // Start creating a review
    const response = await apiClient.post("/dashboard/createReview", data);

    if (response.status === 200) {
      dispatch({
        type: "CREATE_REVIEW_SUCCESS",
        payload: response.data, // Pass the created review
      });
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: "CREATE_REVIEW_FAILURE",
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      dispatch({
        type: "CREATE_REVIEW_FAILURE",
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getReviews = async (dispatch: any) => {
  try {
    dispatch({ type: "GET_REVIEWS_INIT" }); // Dispatch an action to initialize the review fetching process
    const response = await apiClient.get("/dashboard/getReviews"); // Replace with the correct API endpoint

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: "GET_REVIEWS_SUCCESS", payload: response.data }); // Dispatch success action with the response payload
    }
    return response.data; // Return the response data
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: "GET_REVIEWS_FAILURE",
        payload: error.response.data.message,
      });
      console.error("Review fetch failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: "GET_REVIEWS_FAILURE",
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const createPost = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: CREATE_POST_INIT });
    const response = await apiClient.post("/dashboard/createPost", data);

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: CREATE_POST_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: CREATE_POST_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: CREATE_POST_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getPosts = async (dispatch: any) => {
  try {
    dispatch({ type: GET_POSTS_INIT });
    const response = await apiClient.get("/dashboard/getPosts");

    // If the request was successful

    if (response.status === 200) {
      dispatch({ type: GET_POSTS_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_POSTS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_POSTS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const deleteAccounts = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: DELETE_ACCOUNTS_INIT });
    const response = await apiClient.delete("/dashboard/deleteAccount", {
      params: { id: data?.id },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: DELETE_ACCOUNTS_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: DELETE_ACCOUNTS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: DELETE_ACCOUNTS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const ThemeChanger = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: "Theme_Changer", payload: data });
  } catch (error) {}
};
export const getAccounts = async (
  userId: any,
  page: number,
  limit: number,
  dispatch: any
) => {
  try {
    dispatch({ type: GET_ACCOUNTS_INIT });
    const response = await apiClient.get("/dashboard/getAccounts", {
      params: {
        id: userId,
        page,
        limit,
      },
    });

    if (response.status === 200) {
      const { accounts, accountsCount, totalPages, percentageChange } =
        response.data;
      // Dispatch success with payload containing accounts and pagination info
      dispatch({
        type: GET_ACCOUNTS_SUCCESS,
        payload: { accounts, accountsCount, currentPage: page },
      });

      return {
        accounts,
        totalAccounts: accountsCount,
        totalPages,
        percentageChange,
      }; // Return necessary data
    }
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_ACCOUNTS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Failed to fetch accounts:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_ACCOUNTS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getNotifications = async (dispatch: any) => {
  try {
    dispatch({ type: GET_NOTIFICATIONS_INIT });
    const response = await apiClient.get("/dashboard/getNotifications");

    // If the request was successful

    if (response.status === 200) {
      dispatch({ type: GET_NOTIFICATIONS_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_NOTIFICATIONS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_NOTIFICATIONS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const deleteNotifications = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: DELETE_NOTIFICATIONS_INIT });

    const response = await apiClient.patch(
      `/dashboard/deleteNotification`,
      {},
      {
        params: { id: data?.id },
      }
    );

    // If the request was successful

    if (response.status === 200) {
      dispatch({ type: DELETE_NOTIFICATIONS_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: DELETE_NOTIFICATIONS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: DELETE_NOTIFICATIONS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const clearAllNotifications = async (dispatch: any) => {
  try {
    // Dispatch the initialization action
    dispatch({ type: CLEAR_NOTIFICATIONS_INIT });

    // Make the API call to clear all notifications
    const response = await apiClient.delete(`/dashboard/clearAllNotifications`);

    // On success, dispatch success action with empty payload (since notifications are cleared)
    if (response.status === 200) {
      dispatch({ type: CLEAR_NOTIFICATIONS_SUCCESS, payload: [] }); // Clear the notifications in state
    }

    return response.data; // Optional: Return the data to handle it further if needed
  } catch (error: any) {
    // If an error occurs, dispatch the failure action with the error message
    if (error.response) {
      dispatch({
        type: CLEAR_NOTIFICATIONS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Clear All failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: CLEAR_NOTIFICATIONS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getPostsById = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: GET_POST_INIT });
    const response = await apiClient.get("/dashboard/getPost", {
      params: { id: data?.id },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_POST_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_POST_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_POST_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const updatePost = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: UPDATE_POST_INIT });
    const response = await apiClient.patch(
      `/dashboard/updatePost`,
      {
        title: data?.title,
        description: data?.description,
        userId: data?.userId,
      },
      {
        params: { id: data?.id }, // Params are passed in the config object, separate from the body
      }
    );

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: UPDATE_POST_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: UPDATE_POST_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: UPDATE_POST_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const deletePost = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: DELETE_POST_INIT });
    const response = await apiClient.delete("/dashboard/deletepost", {
      params: { id: data?.id },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: DELETE_POST_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: DELETE_POST_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: DELETE_POST_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const getLoginAttempts = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: GET_LOGINATTEMPT_INIT });
    const response = await apiClient.get("/dashboard/getLoginAttempts", {
      params: { id: data?.id, page: data?.page, limit: data?.limit },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_LOGINATTEMPT_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_LOGINATTEMPT_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_LOGINATTEMPT_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};
export const getGlobalLoginAttempts = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: GET_GLOBAL_LOGINATTEMPT_INIT });
    const response = await apiClient.get("/dashboard/getGlobalLoginAttempts", {
      params: { page: data?.page, limit: data?.limit },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({
        type: GET_GLOBAL_LOGINATTEMPT_SUCCESS,
        payload: response.data,
      });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_GLOBAL_LOGINATTEMPT_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_GLOBAL_LOGINATTEMPT_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const createUrl = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: CREATE_URL_INIT });
    const response = await apiClient.post("/dashboard/createUrl", data);

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: CREATE_URL_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: CREATE_URL_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: CREATE_URL_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getUrl = async (urlId: string, dispatch: any) => {
  try {
    dispatch({ type: GET_URL_INIT });
    const response = await apiClient.get(`/dashboard/getUrl/${urlId}`);

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_URL_SUCCESS, payload: response.data });
    }
    return response.data; // Return the URL for further use if needed
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_URL_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Get URL failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_URL_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getUrls = async (dispatch: any) => {
  try {
    dispatch({ type: GET_URLS_INIT });
    const response = await apiClient.get("/dashboard/getUrls");

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_URLS_SUCCESS, payload: response.data });
    }
    return response.data; // Return the URLs for further use if needed
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_URLS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Get URLs failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_URLS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const updateUrl = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: UPDATE_URL_INIT });
    const response = await apiClient.patch(`/dashboard/updateUrl`, data, {
      params: { id: data?.id },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: UPDATE_URL_SUCCESS, payload: response.data });
    }
    return response.data; // Return the updated URL data for further use if needed
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: UPDATE_URL_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Update URL failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: UPDATE_URL_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const deleteUrl = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: DELETE_URL_INIT });
    const response = await apiClient.delete("/dashboard/deleteUrl", {
      params: { id: data?.id },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: DELETE_URL_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts; // or whatever relevant data you need
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: DELETE_URL_FAILURE,
        payload: error.response.data.message || "Error deleting URL",
      });
      console.error(
        "Delete URL failed:",
        error.response.data.message || "Error deleting URL"
      );
      return error.response.data.message || "Error deleting URL";
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: DELETE_URL_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const createIp = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: CREATE_IP_INIT });
    const response = await apiClient.post("/dashboard/postIp", data); //data will be {blockerId: user?._id, ip: that user enter}

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: CREATE_IP_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: CREATE_IP_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Login failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: CREATE_IP_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getIps = async (dispatch: any) => {
  try {
    dispatch({ type: GET_IP_INIT });
    const response = await apiClient.get(`/dashboard/getIps`);

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_IP_SUCCESS, payload: response.data });
    }
    return response.data; // Return the ips for further use if needed
  } catch (error: any) {
    if (error.response) {
      dispatch({
        type: GET_IP_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Get ip failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_IP_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const deleteIp = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: DELETE_IP_INIT });
    const response = await apiClient.delete("/dashboard/deleteIp", {
      params: { id: data?.id },
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: DELETE_IP_SUCCESS, payload: response.data });
    }
    return response.data.loginAttempts; // or whatever relevant data you need
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: DELETE_IP_FAILURE,
        payload: error.response.data.message || "Error deleting Ip",
      });
      console.error(
        "Delete Ip failed:",
        error.response.data.message || "Error deleting Ip"
      );
      return error.response.data.message || "Error deleting Ip";
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: DELETE_IP_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getTopUser = async (dispatch: any) => {
  try {
    dispatch({ type: GET_TOPUSER_INIT });
    const response = await apiClient.get(`/dashboard/getTopUsers`);

    // If the request was successful
    if (response.status === 200) {
      dispatch({ type: GET_TOPUSER_SUCCESS, payload: response.data });
    }

    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_TOPUSER_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Get top users failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_TOPUSER_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getAccountsStatistics = async (dispatch: any) => {
  try {
    dispatch({ type: GET_ACCOUNT_STATISTICS_INIT });
    const response = await apiClient.get(`/dashboard/getaccountstatistics`);

    // If the request was successful
    if (response.status === 200) {
      dispatch({
        type: GET_ACCOUNT_STATISTICS_SUCCESS,
        payload: response.data,
      });
    }

    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_ACCOUNT_STATISTICS_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Get ACCOUNT STATICS failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_ACCOUNT_STATISTICS_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const createSubscription = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: CREATE_SUBSCRIPTION_INIT });
    const response = await apiClient.post(
      `/dashboard/createSubscription`,
      data
    );

    // If the request was successful
    if (response.status === 200) {
      dispatch({
        type: CREATE_SUBSCRIPTION_SUCCESS,
        payload: response.data,
      });
    }

    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: CREATE_SUBSCRIPTION_FAILURE,
        payload: error.response.data.message,
      });
      console.error("Get ACCOUNT STATICS failed:", error.response.data.message);
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: CREATE_SUBSCRIPTION_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const createSubscriptionHistory = async (data: any, dispatch: any) => {
  try {
    dispatch({ type: CREATE_SUBSCRIPTIONHISTORY_INIT });
    const response = await apiClient.post(
      `/dashboard/createSubscriptionHistory`,
      data
    );
    if (response.status === 201) {
      dispatch({
        type: CREATE_SUBSCRIPTIONHISTORY_SUCCESS,
        payload: response.data,
      });
    }

    return response;
  } catch (error: any) {
    // Handle server or network errors
    if (error.status == 409) {
      return error;
    }
    if (error.response) {
      dispatch({
        type: CREATE_SUBSCRIPTIONHISTORY_FAILURE,
        payload: error.response.data.message,
      });
      console.error(
        "create subscription history failed:",
        error.response.data.message
      );
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: CREATE_SUBSCRIPTIONHISTORY_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getSubscription = async (dispatch: any) => {
  try {
    dispatch({ type: GET_SUBSCRIPTION_INIT });
    const response = await apiClient.get(`/dashboard/getSubscriptions`);

    // If the request was successful
    if (response.status === 200) {
      dispatch({
        type: GET_SUBSCRIPTION_SUCCESS,
        payload: response?.data?.subscriptions,
      });
    }
    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_SUBSCRIPTION_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_SUBSCRIPTION_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

// export const getSubscriptionHistory = async (userId: any, dispatch: any) => {
//   try {
//     dispatch({ type: GET_SUBSCRIPTIONHISTORY_INIT });
//     const response = await apiClient.get(
//       `/dashboard/getMySubscriptionsHistory`,
//       { params: { userId } }
//     );

//     // If the request was successful
//     if (response.status === 200) {
//       dispatch({
//         type: GET_SUBSCRIPTIONHISTORY_SUCCESS,
//         payload: response?.data?.subscriptionHistories,
//       });
//     }

//     return response.data;
//   } catch (error: any) {
//     // Handle server or network errors
//     if (error.response) {
//       dispatch({
//         type: GET_SUBSCRIPTIONHISTORY_FAILURE,
//         payload: error.response.data.message,
//       });
//       return error.response.data.message;
//     } else {
//       console.error("Error:", error.message);
//       dispatch({
//         type: GET_SUBSCRIPTIONHISTORY_FAILURE,
//         payload: error.message,
//       });
//       return error.message;
//     }
//   }
// };

export const getSubscriptionHistory = async (userIds: any[], dispatch: any) => {
  try {
    dispatch({ type: GET_SUBSCRIPTIONHISTORY_INIT });

    const response = await apiClient.get(`/dashboard/getMySubscriptionsHistory`, {
      params: { userIds }, // Pass array of userIds as a query parameter
    });

    // If the request was successful
    if (response.status === 200) {
      dispatch({
        type: GET_SUBSCRIPTIONHISTORY_SUCCESS,
        payload: response?.data?.subscriptionHistories,
      });
    }

    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_SUBSCRIPTIONHISTORY_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_SUBSCRIPTIONHISTORY_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const getSubscriptionHistoryAdmin = async (
  adminId: any,
  dispatch: any
) => {
  try {
    dispatch({ type: GET_ADMINSUBSCRIPTIONHISTORY_INIT });
    const response = await apiClient.get(
      `/dashboard/getAdminSubscriptionHistory`,
      {
        params: {
          adminId,
        },
      }
    );

    // If the request was successful
    if (response.status === 200) {
      console.log('response at the api', response?.data?.subscriptionHistories)
      dispatch({
        type: GET_ADMINSUBSCRIPTIONHISTORY_SUCCESS,
        payload: response?.data?.subscriptionHistories,
      });
    }

    return response.data;
  } catch (error: any) {
    // Handle server or network errors
    if (error.response) {
      dispatch({
        type: GET_ADMINSUBSCRIPTIONHISTORY_FAILURE,
        payload: error.response.data.message,
      });
      return error.response.data.message;
    } else {
      console.error("Error:", error.message);
      dispatch({
        type: GET_ADMINSUBSCRIPTIONHISTORY_FAILURE,
        payload: error.message,
      });
      return error.message;
    }
  }
};

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/dashboard/users");
    if (response?.status !== 200) {
      console.error("Failed to fetch users:", response.statusText);
      return [];
    }

    const data = await response.data;
    return data.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchMessages = async () => {
  try {
    const response = await apiClient.get("/dashboard/messages");  // API endpoint for fetching messages
    if (response?.status !== 200) {
      console.error("Failed to fetch messages:", response.statusText);
      return [];
    }

    const data = response.data;
    return data.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};