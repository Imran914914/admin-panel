import {
  DashActionTypes,
  GET_REVIEWS_INIT,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAILURE,
  CREATE_REVIEW_INIT,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_COUNT_INIT,
  GET_COUNT_FAILURE,
  GET_COUNT_SUCCESS,
  GET_LOGINATTEMPT_FAILURE,
  GET_LOGINATTEMPT_INIT,
  GET_LOGINATTEMPT_SUCCESS,
  GET_POSTS_INIT,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAILURE,
  CREATE_POST_INIT,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  GET_POST_INIT,
  GET_POST_SUCCESS,
  GET_POST_FAILURE,
  UPDATE_POST_INIT,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_INIT,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  GET_ACCOUNTS_FAILURE,
  GET_ACCOUNTS_INIT,
  GET_ACCOUNTS_SUCCESS,
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
  DELETE_ACCOUNTS_SUCCESS,
  DELETE_ACCOUNTS_FAILURE,
  CREATE_URL_INIT,
  CREATE_URL_SUCCESS,
  CREATE_URL_FAILURE,
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
  DELETE_IP_INIT,
  DELETE_IP_SUCCESS,
  DELETE_IP_FAILURE,
  GET_IP_INIT,
  GET_IP_SUCCESS,
  GET_IP_FAILURE,
  CREATE_IP_INIT,
  CREATE_IP_SUCCESS,
  CREATE_IP_FAILURE,
  GET_TOPUSER_INIT,
  GET_TOPUSER_SUCCESS,
  GET_TOPUSER_FAILURE,
  GET_TODAY_COUNT_FAILURE,
  GET_TODAY_COUNT_INIT,
  GET_TODAY_COUNT_SUCCESS,
  GET_ACCOUNT_STATISTICS_FAILURE,
  GET_ACCOUNT_STATISTICS_INIT,
  GET_ACCOUNT_STATISTICS_SUCCESS,
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
  GET_ADMINSUBSCRIPTIONHISTORY_INIT,
  GET_ADMINSUBSCRIPTIONHISTORY_FAILURE,
  GET_ADMINSUBSCRIPTIONHISTORY_SUCCESS,
  GET_SUBSCRIPTION_INIT,
  GET_SUBSCRIPTION_SUCCESS,
  GET_SUBSCRIPTION_FAILURE,
} from "../types";

interface LoginAttempt {
  _id: any;
  status: string;
  userId: string;
  description: string;
  timestamp: Date;
}
interface Posts {
  _id: any;
  status: string;
  user: any;
  description: string;
  title: string;
}
interface Reviews {
  _id: any;
  user: any;
  content: string;
  status: string;
  createdAt: string;
}

interface Urls {
  _id: any;
  status: string;
  user: any;
  description: string;
  title: string;
}
interface DashState {
  userCount: number;
  totalAccounts: number;
  loading: boolean;
  totalPages: number;
  currentPage: number;
  loginAttempts: LoginAttempt[];
  error: string | null;
  posts: Posts[];
  post: null;
  accounts: any;
  notifications: any;
  urls: Urls[];
  currentUrl: any;
  ips: any;
  topUsers: any;
  adminHistoryLogs: any[];
  globaltotalPages: any;
  globalCurrentPage: any;
  todaysCount: any;
  account_stats: any;
  beep: any;
  globalLoginAttempts: LoginAttempt[];
  subscriptions: any[];
  subscriptionLogs: any[];
  reviews: Reviews[];
}

const initialState: DashState = {
  reviews: [],
  userCount: 0,
  loginAttempts: [],
  globalLoginAttempts: [],
  totalPages: 1,
  currentPage: 1,
  globaltotalPages: 1,
  globalCurrentPage: 1,
  loading: false,
  error: null,
  posts: [],
  post: null,
  beep: false,
  accounts: [],
  notifications: [],
  totalAccounts: 0,
  urls: [],
  ips: [],
  currentUrl: null,
  topUsers: [],
  todaysCount: 0,
  account_stats: [],
  subscriptions: [],
  subscriptionLogs: [],
  adminHistoryLogs: [],
};

export const dashReducer = (
  state = initialState,
  action: DashActionTypes
): DashState => {
  switch (action.type) {
    case GET_COUNT_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_COUNT_FAILURE:
      return {
        ...state,
        userCount: action.payload,
        loading: false,

        error: null,
      };
    case GET_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_TODAY_COUNT_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_TODAY_COUNT_SUCCESS:
      return {
        ...state,
        todaysCount: action.payload?.TotalTodayUsers,
        loading: false,

        error: null,
      };
    case GET_TODAY_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ACCOUNT_STATISTICS_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_ACCOUNT_STATISTICS_SUCCESS:
      return {
        ...state,
        account_stats: action.payload?.monthlyData,
        loading: false,

        error: null,
      };
    case GET_ACCOUNT_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_LOGINATTEMPT_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_LOGINATTEMPT_SUCCESS:
      return {
        ...state,
        totalPages: action?.payload?.totalPages,
        currentPage: action?.payload?.currentPage,
        loginAttempts: action.payload?.loginAttempts,
        loading: false,
        error: null,
      };
    case GET_LOGINATTEMPT_FAILURE:
      return {
        ...state,
        loading: false,
        loginAttempts: [],
        error: action.payload,
      };
    case GET_GLOBAL_LOGINATTEMPT_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_GLOBAL_LOGINATTEMPT_SUCCESS:
      return {
        ...state,
        globaltotalPages: action?.payload?.globaltotalPages,
        globalCurrentPage: action?.payload?.globalCurrentPage,
        globalLoginAttempts: action.payload?.globalLoginAttempts,
        loading: false,
        error: null,
      };
    case GET_GLOBAL_LOGINATTEMPT_FAILURE:
      return {
        ...state,
        loading: false,
        globalLoginAttempts: [],
        error: action.payload,
      };

    case GET_POSTS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action?.payload,
      };

    case GET_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_POST_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: [action.payload, ...state.posts],
      };

    case CREATE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_POST_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
      };

    case GET_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_POST_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    case UPDATE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_POST_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter(
          (post) => post._id !== action.payload.post._id
        ),
      };

    case DELETE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ACCOUNTS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ACCOUNTS_SUCCESS:
      let beeplocal = false;
      if (action?.payload?.accountsCount > state.totalAccounts) {
        beeplocal = true;
      }
      return {
        ...state,
        beep: beeplocal,
        loading: false,
        accounts: action?.payload?.accounts,
        totalAccounts: action?.payload?.accountsCount,
      };

    case GET_ACCOUNTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_NOTIFICATIONS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };

    case GET_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_NOTIFICATIONS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.filter(
          (notif: any) => notif._id !== action.payload.post._id
        ),
      };

    case DELETE_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_ACCOUNTS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        accounts: state.accounts.filter(
          (notif: any) => notif?._id !== action?.payload?.account?._id
        ),
      };

    case DELETE_ACCOUNTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_URL_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_URL_SUCCESS:
      return {
        ...state,
        urls: [...state.urls, action.payload],
        loading: false,
      };
    case CREATE_URL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get all URLs
    case GET_URLS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_URLS_SUCCESS:
      return {
        ...state,
        urls: action.payload,
        loading: false,
      };
    case GET_URLS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get a single URL by ID
    case GET_URL_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_URL_SUCCESS:
      return {
        ...state,
        currentUrl: action.payload,
        loading: false,
      };
    case GET_URL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update URL
    case UPDATE_URL_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_URL_SUCCESS:
      return {
        ...state,
        urls: state.urls.map((url) =>
          url._id === action.payload._id ? action.payload : url
        ),
        loading: false,
      };
    case UPDATE_URL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete URL
    case DELETE_URL_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_URL_SUCCESS:
      return {
        ...state,
        urls: state.urls.filter((url) => url._id !== action.payload.url._id),
        loading: false,
      };
    case DELETE_URL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_IP_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_IP_SUCCESS:
      return {
        ...state,
        ips: [...state.ips, action?.payload?.newIp],
        loading: false,
      };
    case CREATE_IP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get all ips
    case GET_IP_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_IP_SUCCESS:
      return {
        ...state,
        ips: action.payload,
        loading: false,
      };
    case GET_IP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_IP_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_IP_SUCCESS:
      return {
        ...state,
        ips: state.ips.filter((ip: any) => ip._id !== action.payload.ip._id),
        loading: false,
      };
    case DELETE_IP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_TOPUSER_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_TOPUSER_SUCCESS:
      return {
        ...state,
        topUsers: action.payload,
        loading: false,
      };
    case GET_TOPUSER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CREATE_REVIEW_INIT":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CREATE_REVIEW_SUCCESS":
      return {
        ...state,
        loading: false,
        reviews: [...state.reviews, action.payload],
      };

    case "CREATE_REVIEW_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_REVIEWS_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload,
      };

    case GET_REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_NOTIFICATIONS_INIT:
      return {
        ...state,
        loading: true, // Set loading to true while the request is in progress
        error: null, // Clear any previous errors
      };

    case CLEAR_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        error: null,
      };

    case CLEAR_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_SUBSCRIPTION_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_SUBSCRIPTIONHISTORY_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_SUBSCRIPTIONHISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_SUBSCRIPTIONHISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_SUBSCRIPTION_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptions: action.payload,
      };
    case GET_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_SUBSCRIPTIONHISTORY_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SUBSCRIPTIONHISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptionLogs: action.payload,
      };
    case GET_SUBSCRIPTIONHISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_ADMINSUBSCRIPTIONHISTORY_INIT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ADMINSUBSCRIPTIONHISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        adminHistoryLogs: action.payload
      };
    case GET_ADMINSUBSCRIPTIONHISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
