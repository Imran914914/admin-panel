import {
  AuthActionTypes,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTERED_SUCCESS,
  REGISTERED_FAILURE,
  LOGIN_INIT,
  REGISTERED_INIT,
  LOGOUT,
  EDIT_PROFILE_FAILURE,
  EDIT_PROFILE_INIT,
  EDIT_PROFILE_SUCCESS,
  GET_GLOBAL_USER_SUCCESS,
  GET_GLOBAL_USER_INIT,
  GET_GLOBAL_USER_FAILURE,
  DELETE_PROFILE_INIT,
  DELETE_PROFILE_FAILURE,
  DELETE_PROFILE_SUCCESS,
} from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  deleteduser: any;
  token: any;
  allUsers: any;
  allUsersCount: any;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  token: null,
  allUsers: [],
  allUsersCount: 0,
  deleteduser: null,
  error: null,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOGIN_INIT:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        token: action?.payload?.token,
        user: action?.payload?.user,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        token: null,
        error: null,
      };

    case REGISTERED_INIT:
      return {
        ...state,
        loading: true,
      };
    case REGISTERED_SUCCESS:
      return {
        ...state,
        // isAuthenticated: true,
        loading: false,
        // token: action.payload.token,
        // user: action.payload.user,
        error: null,
      };
    case REGISTERED_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case EDIT_PROFILE_INIT:
      return {
        ...state,
        loading: true,
      };
    case EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case EDIT_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload,
      };
    case DELETE_PROFILE_INIT:
      return {
        ...state,
        loading: true,
      };
    case DELETE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteduser: action.payload.deletedUser,
        allUsers: state.allUsers.filter(
          (user: any) => user._id !== action.payload.deletedUser._id
        ),
        error: null,
      };
    case DELETE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload,
      };
    case GET_GLOBAL_USER_INIT:
      return {
        ...state,
        loading: true,
      };
    case GET_GLOBAL_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        allUsers: action.payload.allUsers,
        allUsersCount: action.payload.allUsersCount,
        error: null,
      };
    case GET_GLOBAL_USER_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
