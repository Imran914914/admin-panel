import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from "./reducer";


export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root', // Key in localStorage
  storage, // This uses localStorage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(thunk), 
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== "production", // Enable DevTools in development
});


// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
//   devTools: process.env.NODE_ENV !== "production", // Enable DevTools in development
// });

export const persistor = persistStore(store);

export default store;
