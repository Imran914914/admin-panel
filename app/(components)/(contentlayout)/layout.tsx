"use client";
import Backtotop from "@/shared/layout-components/backtotop/backtotop";
import Footer from "@/shared/layout-components/footer/footer";
import Header from "@/shared/layout-components/header/header";
import Sidebar from "@/shared/layout-components/sidebar/sidebar";
import Switcher from "@/shared/layout-components/switcher/switcher";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Layout = ({ children }: any) => {
  const [loading, setLoading] = useState(true); // For waiting on auth check
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const user = useSelector((state: any) => state.auth.user);
  const isVerified = user?.is2FAverified;
  const isBanned = user?.isBanned;
  useEffect(() => {
    if (isAuthenticated == undefined) {
    }
    if (isVerified == undefined) {
    }
    if (isBanned == undefined) {
    }

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push("/");
    } else {
      // Allow page to load once auth is confirmed
      setLoading(false);
    }
    if (user?.is2FAEnabled && !isVerified) {
      // Redirect to login page if not authenticated
      router.push("/");
    } else {
      // Allow page to load once auth is confirmed
      setLoading(false);
    }
    if (isBanned) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router, isVerified]);
  const local_varaiable = useSelector((state: any) => state);

  useEffect(() => {
    const themeMode = local_varaiable.dataThemeMode || "dark";
    document.documentElement.setAttribute("data-theme-mode", themeMode);
    document.body.className = themeMode;
  }, [local_varaiable.dataThemeMode]);

  if (loading || isAuthenticated === undefined) {
    // Show a loading spinner or nothing while auth is being checked
    return <div>Loading...</div>;
  }

  return (
    <>
      <Switcher />
      <div className="page">
        <Header />
        <Sidebar />
        <div className="main-content app-content">
          <div className="container-fluid">{children}</div>
        </div>
        <Footer />
      </div>
      <Backtotop />
    </>
  );
};

export default Layout;
