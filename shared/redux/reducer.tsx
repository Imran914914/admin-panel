import { combineReducers } from "redux";
import { authReducer } from "./reducer/authreducer";
import { Themereducer } from "./reducer/Themereducer";
import { dashReducer } from "./reducer/dashboard";

const rootReducer = combineReducers({
  auth: authReducer,
  theme: Themereducer,
  dash: dashReducer
});

export default rootReducer;
