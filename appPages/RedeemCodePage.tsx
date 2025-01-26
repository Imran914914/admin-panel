"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row, Pagination } from "react-bootstrap";
import Seo from "@/shared/layout-components/seo/seo";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubscriptionHistory,
  getSubscriptionHistoryAdmin,
} from "@/shared/Api/dashboard";

const RedeemCodePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const redeemCodes = useSelector((state: any) => state.dash.subscriptions);
  let subLogs = useSelector((state: any) => state.dash);
  if (user?.role == "admin") {
    subLogs = subLogs?.adminHistoryLogs;
  } else {
    subLogs = subLogs?.subscriptionLogs;
  }
  const [filteredRedeemCode, setFilterRedeemCode] = useState([]);
  useEffect(() => {
    getUserLogs();
    const filterCodes = redeemCodes.filter(
      (redeem: any) => redeem?.type == "redeem"
    );
    setFilterRedeemCode(filterCodes);
  }, [redeemCodes, user]);
  const codes = [
    {
      id: 1,
      date: Date.now(),
      user: "imran1",
      code: 63274,
    },
    {
      id: 2,
      user: "imran1",
      code: 63274,
    },
    {
      id: 3,
      user: "imran1",
      code: 63274,
    },
    {
      id: 4,
      user: "imran1",
      code: 63274,
    },
    {
      id: 5,
      user: "imran1",
      code: 63274,
    },
  ];

  const getUserLogs = async () => {
    // need to check this
    if (user?.role == "admin") {
      await getSubscriptionHistoryAdmin(user?._id, dispatch);
    } else {
      await getSubscriptionHistory(user?._id, dispatch);
    }
  };
  return (
    <Fragment>
      <Seo title={"redeem-codes"} />
      <Row className="mt-2">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>
                {user?.role == "admin" ? "Redeem Codes" : "Subscription Logs"}
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              {user?.role == "admin" ? (
                <div className="table-responsive">
                  <table className="table text-nowrap">
                    <thead>
                      <th>Username</th>
                      <th>Code</th>
                      <th>Amount</th>
                      <th>Duration</th>
                      <th>start Date</th>
                      <th>Expire Date</th>
                    </thead>
                    <tbody>
                      {subLogs?.length > 0 &&
                        subLogs?.map((code: any) => (
                          <tr key={code._id}>
                            <td>{code?.userDetails?.userName}</td>
                            <td>{code?.subscriptionDetails?.redeemCode}</td>
                            <td>{code?.subscriptionDetails?.amount}</td>
                            <td>{code?.subscriptionDetails?.duration} {parseInt(code?.subscriptionDetails?.duration) > 1 ? 'Months' : 'Month'}</td>
                            <td>
                              {moment(code?.startDate).format(
                                "ddd, MMM DD, YYYY, hh:mm A"
                              )}
                            </td>
                            <td>
                              {moment(code?.expireDate).format(
                                "ddd, MMM DD, YYYY, hh:mm A"
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table text-nowrap">
                    <thead>
                      <th>Code</th>
                      <th>Amount</th>
                      <th>start Date</th>
                      <th>Expire Date</th>
                    </thead>
                    <tbody>
                      {subLogs?.length > 0 &&
                        subLogs?.map((code: any) => (
                          <tr key={code._id}>
                            <td>
                              {code?.subscriptionId?.redeemCode ??
                                code?.subscriptionId?.type}
                            </td>
                            <td>{code?.subscriptionId?.amount + "$"}</td>
                            <td>
                              {moment(code?.startDate).format("MMM DD, YYYY")}
                            </td>
                            <td>
                              {moment(code?.expireDate).format("MMM DD, YYYY")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <div className="d-flex align-items-center">
                <div>
                  <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                </div>
                <div className="ms-auto">
                  <nav
                    aria-label="Page navigation"
                    className="pagination-style-4"
                  ></nav>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {user?.role == "admin" && (
        <Row>
          <Col xl={12}>
            <Card className="custom-card">
              <Card.Header className="justify-content-between">
                <Card.Title>generated Codes</Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table text-nowrap">
                    <thead>
                      <th>Username</th>
                      <th>Codes</th>
                      <th>Date</th>
                    </thead>
                    <tbody>
                      {filteredRedeemCode &&
                        filteredRedeemCode?.length &&
                        filteredRedeemCode?.map((code: any) => (
                          <tr key={code._id}>
                            <td>{code?.createdBy?.userName}</td>
                            <td>{code?.redeemCode}</td>
                            <td>
                              {moment(code?.createdAt).format(
                                "ddd, MMM DD, YYYY, hh:mm A"
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex align-items-center">
                  <div>
                    <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                  </div>
                  <div className="ms-auto">
                    <nav
                      aria-label="Page navigation"
                      className="pagination-style-4"
                    ></nav>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

export default RedeemCodePage;
