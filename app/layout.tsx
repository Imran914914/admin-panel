"use client";
import { Provider } from "react-redux";
import "./globals.scss";
import store, { persistor } from "@/shared/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const RootLayout = ({ children }: any) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
export default RootLayout;
