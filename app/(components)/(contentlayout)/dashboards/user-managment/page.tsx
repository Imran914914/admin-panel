"use client";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row, Pagination, Button } from "react-bootstrap";
import { Trash2, Pencil } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { FaSpinner } from "react-icons/fa";
import Popup from "@/components/Popup";
import { deleteProfile, getGlobalUser, banUser } from "@/shared/Api/auth";
import {
  createSubscriptionHistory,
  getSubscriptionHistory,
} from "@/shared/Api/dashboard";
import Success from "@/components/SuccessPop";
import { useRouter } from "next/navigation";
function page() {
  const dispatch = useDispatch();
  const allUsers = useSelector((state: any) => state.auth.allUsers);
  const user = useSelector((state: any) => state.auth.user);
  const allUsersCount = useSelector((state: any) => state.auth.allUsersCount);
  const loading = useSelector((state: any) => state.auth.loading);
  const subscriptions = useSelector((state: any) => state.dash.subscriptions);
  const userSubscription = useSelector(
    (state: any) => state.dash.subscriptionLogs
  );
  // console.log("userSubs:  ",userSubscription)
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updateId, setUpdate] = useState("");
  const [error, setError] = useState("");
  const [reasonValue, setReasonValue] = useState("");
  const [postPopup, setPostPopup] = useState(true);
  const [userValue, setUserValue] = useState({});
  const [userForBan, setUserForBan] = useState({});
  const [open, setOpen] = useState(false);
  const [title, setTittle] = useState("");
  const [userSubscriptionHistories, setUserSubscriptionHistories] = useState<
    any[]
  >([]);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const router = useRouter()
  const getAllUser = async (data: any) => {
    await getGlobalUser(data, dispatch);
  };

  useEffect(() => {
    getAllUser({ page: currentPage, limit: 10 });
  }, [currentPage]);

  const handleOpenPopup = () => {
    setPostPopup(true);
    setIsPopupOpen(true);
  };
  const handleClosePopup: any = () => {
    setIsPopupOpen(false);
  };

  const filterPosts = async (postToDelete: any) => {
    try {
      if (!postToDelete?.id) {
        console.warn("Invalid user for deletion.");
        return;
      }
  
      // Call your delete function
      const result = await deleteProfile({ id: postToDelete?.id }, dispatch);
  
      if (result?.status===200) {
        console.log("User deleted successfully.");
  
        // Refetch updated users and dispatch to Redux
        const updatedUsers = await getAllUser(dispatch); // make sure this updates Redux store inside
        console.log("Updated users after deletion:", updatedUsers);
  
        // Refresh subscription histories with new list
        fetchSubscriptionHistories();
      } else {
        console.warn("User deletion failed.");
      }
    } catch (error) {
      console.error("Error in filterPosts:", error);
    }
  };
  

  const handleUpdate = (user: any) => {
    setUpdate(user?.id);
    setUserValue({
      userName: user?.userName,
      email: user?.email,
      password: "",
      bio: user?.bio,
    });
    handleOpenPopup();
  };

  const handleReasonValue = (e: any) => {
    setReasonValue(e.target.value);
  };

  const handleSubmit = async (user: any) => {
    const response = await banUser({
      userId: user?.id,
      banReason: reasonValue,
      isBanned: true,
    });
    // console.log(response.status)
    if (response?.status === 200) {
      setShowPopup(false);
      window.location.reload();
    }
  };

  const handleUnban = async (user: any) => {
    // console.log("user for unban:          ",user)
    const response = await banUser({
      userId: user?.id,
      isBanned: false, // Set `isBanned` to false for unbanning
      banReason: "", // Clear the ban reason
    });
    // console.log("response:     ",response.status)
    if (response?.status === 200) {
      window.location.reload();
    }
  };

  const handleAssignSubscription = async (user: any, subscriptionId: any) => {
    let selectedSubscription = subscriptions.filter(
      (sub: any) => sub?.id == subscriptionId
    );
    selectedSubscription = selectedSubscription[0];
    // if (!subscriptionId) {
    //   alert("Please select a subscription.");
    //   return;
    // }

    try {
      const payload = {
        userId: user.id,
        subscriptionId,
        startDate: new Date(),
        expireDate: new Date(
          new Date().setMonth(
            new Date().getMonth() + selectedSubscription.duration
          )
        ),
        active: true,
        redeem: selectedSubscription?.type == "redeem" ? true : false, // Update as required
      };
      const response = await createSubscriptionHistory(payload, dispatch);

      if (response.status === 201) {
        setTittle("Subscription assigned successfully.");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      } else if (response.status === 409) {
        setTittle(response.response.data.message);
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
        return;
      }
    } catch (error: any) {
      setTittle("Failed to assign subscription. Please try again.");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  };

  const fetchSubscriptionHistories = async () => {
    if (Array.isArray(allUsers) && allUsers.length > 0) {
      // Safely extract user IDs
      const userIds = allUsers.map((user: any) => user?.id).filter(Boolean);
      
      console.log("all user:  ", allUsers)

      if (userIds.length === 0) {
        console.warn("No valid user IDs found.");
        return;
      }
  
      try {
        const histories = await getSubscriptionHistory(userIds, dispatch);
        if (histories?.subscriptionHistories) {
          console.log("Fetched subscription histories:", histories.subscriptionHistories);
          setUserSubscriptionHistories(histories.subscriptionHistories);
        } else {
          console.error("Failed to fetch subscription histories");
        }
      } catch (error) {
        console.error("Error while fetching subscription histories:", error);
      }
    } else {
      console.warn("No users available to fetch subscription histories.");
    }
  };  

  useEffect(() => {
    fetchSubscriptionHistories();
    if(user?.role==="basic"){
      router.replace("/dashboards/home")
    }
  }, [allUsers, dispatch, user?.role]);

  return (
    <Fragment>
      <Success isOpen={open} title={title} />
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center  z-50">
          <div className="bg-white rounded-lg w-full max-w-xl p-6 relative shadow-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 h-8 w-8 flex items-center justify-center rounded-full shadow z-50"
            >
              &times;
            </button>
            <div className="p-0 border-0">
              <Card className="custom-card overflow-hidden">
                <div className="verify-token-section py-4 px-5">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="banReason">Enter ban reason</label>
                      <input
                        type="text"
                        id="banReason"
                        className="form-control"
                        value={reasonValue}
                        onChange={handleReasonValue}
                        placeholder="Enter ban reason"
                      />
                    </div>
                    {error && (
                      <p className="text-danger text-center mb-4">{error}</p>
                    )}
                    <div className="d-flex justify-content-center">
                      {loading ? (
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled
                        >
                          <FaSpinner className="spinner-border spinner-border-sm" />{" "}
                          loading...
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-success w-auto"
                          onClick={() => {
                            handleSubmit(userForBan);
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
      <Seo title={"user-management"} />
      <Row className="mt-2">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Users</Card.Title>
              <div className="d-flex flex-wrap gap-2">
                <div className="flex justify-between gap-2">
                  <Popup
                    usermanagment={postPopup}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    userValue={userValue}
                    setUserValue={setUserValue}
                    updateId={updateId}
                    setUpdate={setUpdate}
                  />
                  {/* {allUsers?.length ? (
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      placeholder="Search Here"
                      aria-label=".form-control-sm example"
                    />
                  ) : null} */}
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table text-nowrap">
                  <thead>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    {/* <th>Password</th> */}
                    <th>Date</th>
                    <th>Subscription History</th>
                    <th>Actions</th>
                    <th>Ban User</th>
                  </thead>
                  <tbody>
                    {allUsers
                      ?.slice()
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((user: any) => (
                        <tr
                          key={user.id}
                          className={
                            user.role === "admin"
                              ? "text-blue-500"
                              : userSubscription?.some(
                                  (id: any) => id.userId === user.id
                                )
                              ? "text-red-400"
                              : ""
                          }
                        >
                          <td>
                            <img
                              src={
                                user?.profileImage ??
                                "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b"
                              }
                              alt="img"
                              className="avatar avatar-xs avatar-rounded mb-1"
                            />
                          </td>
                          <td>{user?.userName}</td>
                          <td>{user && <span>{user?.email}</span>}</td>
                          <td>
                            <div className="btn-list">
                              {moment(user?.createdAt).format(
                                "ddd, MMM DD, YYYY, hh:mm A"
                              )}
                            </div>
                          </td>
                          <td>
                            {!user?.isBanned && (
                              <>
                                {userSubscription?.some(
                                  (history: any) => history.userId === user.id
                                ) ? (
                                  <div>
                                    {
                                      userSubscription.find(
                                        (history: any) =>
                                          history.userId === user.id
                                      )?.subscription?.type
                                    }{" "}
                                    -{" "}
                                    {
                                      userSubscription.find(
                                        (history: any) =>
                                          history.userId === user.id
                                      )?.subscription?.duration
                                    }{" "}
                                    months - $
                                    {
                                      userSubscription.find(
                                        (history: any) =>
                                          history.userId === user.id
                                      )?.subscription?.amount
                                    }
                                  </div>
                                ) : (
                                  <select
                                    className="w-48 flex  gap-0 text-center form-select"
                                    onChange={(e) =>
                                      handleAssignSubscription(
                                        user,
                                        e.target.value
                                      )
                                    }
                                    defaultValue=""
                                  >
                                    <option value="" disabled>
                                      Select Subscription
                                    </option>
                                    {subscriptions?.map((sub: any) => (
                                      <option key={sub?.id} value={sub?.id}>
                                        {sub?.type} - {sub?.duration} months - $
                                        {sub?.amount}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </>
                            )}
                          </td>
                          <td>
                            {user?.role === "basic" && (
                              <div className="flex py-2 justify-start gap-2">
                                <button
                                  className="text-red-500 mr-2"
                                  onClick={() => filterPosts(user)}
                                >
                                  <Trash2 size={14} />
                                </button>
                                <button
                                  className="text-blue-500"
                                  onClick={() => handleUpdate(user)}
                                >
                                  <Pencil size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                          <td>
                            {user?.role === "basic" && (
                              <Button
                                className={`w-20 ${
                                  user?.isBanned
                                    ? "btn-success text-white"
                                    : "bg-blue-500 text-white"
                                } py-2 rounded`}
                                onClick={() => {
                                  if (user?.isBanned) {
                                    handleUnban(user);
                                  } else {
                                    setShowPopup(true);
                                    setUserForBan(user);
                                  }
                                }}
                              >
                                {user?.isBanned ? "Unban" : "Ban"}
                              </Button>
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
                  Showing {allUsersCount} Entries{" "}
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
                        length: Math.ceil(allUsersCount / itemsPerPage),
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
                          Math.ceil(allUsersCount / itemsPerPage)
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
  );
}

export default page;
