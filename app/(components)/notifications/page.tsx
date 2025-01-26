"use client";
import Link from "next/link";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteNotifications,
  getNotifications,
  clearAllNotifications, // Add new API function
} from "@/shared/Api/dashboard";

const page = () => {
  const [notification, setNotification] = useState<any>([]);
  const notifications = useSelector((state: any) => state.dash.notifications);
  const dispatch = useDispatch();

  // Single notification close
  const handleNotificationClose = async (index: number, event: any) => {
    console.log("notification id", event?._id);
    await deleteNotifications({ id: event?._id }, dispatch);

    // Close the entire tab
    window.close();
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      await clearAllNotifications(dispatch); // API call to delete all
      setNotification([]); // Clear notifications locally
    } catch (error) {
      console.error("Failed to clear all notifications", error);
    }
  };

  // Fetch notifications
  const getNotificationslocal = async () => {
    await getNotifications(dispatch);
  };

  useEffect(() => {
    getNotificationslocal();
    setNotification(notifications);
  }, [notifications]);

  return (
    <Fragment>
      <Seo title={"notifications"} />
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>All Notifications</Card.Title>
              {/* Clear All Button */}
              <Button 
              disabled={notification.length === 0}
              onClick={handleClearAll}
              >Clear All</Button>
            </Card.Header>
            <Card.Body>
                <table className="table">
                  <tbody>
                    {notification && notification.length > 0 ? (
                      notification.map((idx: any, index: any) => (
                        <tr key={idx._id}>
                          <td className="w-100">{idx?.message}</td>
                          <td className="text-end">
                            <i
                              className="ri-close-circle-line fs-5 cursor-pointer"
                              onClick={() =>
                                handleNotificationClose(index, idx)
                              }
                            ></i>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-center">
                          No notifications available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default page;
