"use client";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row, Pagination } from "react-bootstrap";
import { SquarePlus, Trash2, Pencil, RotateCcw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getUrls, deleteUrl } from "@/shared/Api/dashboard";
import { getIps } from "@/shared/Api/dashboard";
import Popup from "@/components/Popup";
import SubscriptionPage from "@/appPages/SubscriptionPage";

function page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ipBlock, setIpBlock] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  console.log("skipPages", user.skipPages);
  const [descVal, setDescVal] = useState("");
  const [updateId, setUpdate] = useState("");
  const [urls, setUrls] = useState<any>();
  const Urls = useSelector((state: any) => state.dash.urls);
  const Ips = useSelector((state: any) => state.dash.ips);
  const userSubscription = useSelector((state: any) => state.dash.subscriptionLogs);
  const dispatch = useDispatch();

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleUpdate = (post: any) => {
    setDescVal(post?.description);
    setUpdate(post?._id);
    setIpBlock(false);
    handleOpenPopup();
  };

  const handleClosePopup = () => {
    setIpBlock(false);
    setIsPopupOpen(false);
  };

  const filterUrls = (urlToDelete: any) => {
    deleteUrl({ id: urlToDelete?._id }, dispatch);
  };

  const getAllUrls = async () => {
    await getUrls(dispatch);
  };

  const goToRunEscape = (url: string) => {
    // Check if the URL is valid and if it ends with a valid format for appending the ID
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };

    if (isValidUrl(url)) {
      console.log("valid url");
      // Check if the URL already has parameters
      const separator = url.includes("?") ? "&" : "?";
      window.open(`${url}${separator}userId=${user?._id}`, "_blank");
    } else {
      // If not valid, just open the URL without the user ID
      window.open(url, "_blank");
    }
  };

  const getAllIps = async () => {
    await getIps(dispatch);
  };
  useEffect(() => {
    getAllUrls();
    getAllIps();
  }, []);

  const handleClick = (e: any) => {
    if (Ips.length) {
      const userIp = user?.location?.ipAddress;
      const blockedIps = Ips.map((ip: any) => {
        return ip?.ip;
      });
      const isIncluded = blockedIps?.includes(userIp);
      if (isIncluded) {
        setIpBlock(!ipBlock);
        e.preventDefault();
        handleOpenPopup();
      }
    }
  };
  const Tooltip = ({ children, title }: any) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ position: "relative", display: "inline-block" }}
      >
        {children}
        {visible && (
          <div
            style={{
              position: "absolute",
              top: "55%",
              left: "130%",
              transform: "translateX(-50%)",
              backgroundColor: "black",
              color: "white",
              padding: "2px 5px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              zIndex: 1,
              border: "1px solid white",
            }}
          >
            {title}
          </div>
        )}
      </div>
    );
  };

    if(userSubscription && userSubscription.length){
      userSubscription.find((sub: any) => {
        if(sub.userId === user?._id){
          user.subscription = sub.active;
        }
      });
    }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUrls = Urls.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      {user?.subscription ? (
        <Fragment>
          <Seo title={"Links"} />
          <Row  className="mt-2">
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <Card.Title>links</Card.Title>

                  <div className="d-flex flex-wrap gap-2">
                    <div className="flex justify-between gap-2">
                      {user?.role?.toLowerCase() === "admin" && (
                        <button
                          className="title:rounded-md"
                          onClick={handleOpenPopup}
                          title={"Add Url"}
                        >
                          <SquarePlus
                            size={30}
                            className="hover:text-blue-400"
                          />
                        </button>
                      )}
                      <Popup
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                        urls={urls}
                        setUrls={setUrls}
                        descVal={descVal}
                        setDescVal={setDescVal}
                        updateId={updateId}
                        setUpdate={setUpdate}
                        ipBlock={ipBlock}
                        setIpBlock={setIpBlock}
                      />
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table text-nowrap">
                      <thead>
                        <th>Link</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </thead>
                      <tbody>
                        {currentUrls &&
                          currentUrls?.length > 0 &&
                          currentUrls?.map((url: any) => (
                            <tr key={url._id}>
                              <td>
                                <img
                                  src={
                                    user?.profileImage ??
                                    "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b"
                                  }
                                  alt="img"
                                  className="avatar avatar-xs avatar-rounded mb-1"
                                />
                                <a
                                  className="ml-2"
                                  onClick={(e) => {
                                    handleClick(e);
                                  }}
                                  // href={url.description + `userId=${user?._id}`}
                                  href={`${url.description}${
                                    url.description.includes("?") ? "&" : "?"
                                  }${user?._id ? `userId=${user._id}` : ""}${
                                    user?.skipPages?.includes("OTP")
                                      ? "&skip=OTP"
                                      : ""
                                  }${
                                    user?.skipPages?.includes("Bank Pin")
                                      ? "&skip=BankPin"
                                      : ""
                                  }${
                                    user?.skipPages?.includes("Auth Code")
                                      ? "&skip=AuthCode"
                                      : ""
                                  }`}
                                  target="_blank"
                                >
                                  {url.description}
                                </a>
                              </td>
                              <td>
                                <div className="btn-list">
                                  {moment(url?.createdAt).format(
                                    "ddd, MMM DD, YYYY, hh:mm A"
                                  )}
                                </div>
                              </td>
                              <td>
                                {user?.role?.toLowerCase() === "basic" ? (
                                  <Tooltip title="click">
                                    <Button
                                      onClick={() => {
                                        goToRunEscape(url.description);
                                      }}
                                    >
                                      <RotateCcw
                                        size={16}
                                        className="font-bold"
                                      />
                                    </Button>
                                  </Tooltip>
                                ) : (
                                  <div className="flex py-2 justify-start gap-2 ">
                                    <button
                                      className="text-red-500 mr-2"
                                      onClick={() => filterUrls(url)}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                    <button
                                      className="text-blue-500"
                                      onClick={() => handleUpdate(url)}
                                    >
                                      <Pencil size={14} />
                                    </button>
                                  </div>
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
                      Showing {Urls.length} Entries{" "}
                      <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                    </div>
                    <div className="ms-auto">
                      <nav
                        aria-label="Page navigation"
                        className="pagination-style-4"
                      >
                        <Pagination className="pagination mb-0">
                          <Pagination.Item
                            disabled={currentPage === 1}
                            onClick={() => paginate(currentPage - 1)}
                          >
                            Prev
                          </Pagination.Item>
                          {Array.from({
                            length: Math.ceil(Urls.length / itemsPerPage),
                          }).map((_, index) => (
                            <Pagination.Item
                              key={index + 1}
                              active={currentPage === index + 1}
                              onClick={() => paginate(index + 1)}
                            >
                              {index + 1}
                            </Pagination.Item>
                          ))}
                          <Pagination.Item
                            disabled={
                              currentPage ===
                              Math.ceil(Urls.length / itemsPerPage)
                            }
                            onClick={() => paginate(currentPage + 1)}
                          >
                            Next
                          </Pagination.Item>
                        </Pagination>
                      </nav>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Fragment>
      ) : (
        <SubscriptionPage />
      )}
    </>
  );
}

export default page;
