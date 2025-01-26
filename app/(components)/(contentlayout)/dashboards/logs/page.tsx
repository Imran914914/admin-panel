'use client'
import React from "react";
import CallLogsPage from "@/appPages/CallLogsPage";
import SubscriptionPage from "@/appPages/SubscriptionPage";
import { useSelector } from "react-redux";
const CallLogs = () => {
  const user = useSelector((state: any) => state.auth.user);
  const userSubscription = useSelector((state: any) => state.dash.subscriptionLogs);
  if(userSubscription && userSubscription.length){
    userSubscription.find((sub: any) => {
      if(sub.userId === user?._id){
        user.subscription = sub.active;
      }
    });
  }
  return (
    <>
      {user?.subscription ? (
        <CallLogsPage />
      ) : (
        <SubscriptionPage />
      )}
    </>
  );
};

export default CallLogs;
