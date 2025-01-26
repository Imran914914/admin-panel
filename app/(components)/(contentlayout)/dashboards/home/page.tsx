"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Dropdown, Pagination, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import {
  getAlluserCount,
  getLoginAttempts,
  getPosts,
  getReviews,
  deletePost,
  getAccounts,
  getTodayuserCount,
  getAccountsStatistics,
  getGlobalLoginAttempts,
  getSubscription,
  getSubscriptionHistory,
} from "@/shared/Api/dashboard";
import moment from "moment";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import * as Salesdata from "@/shared/data/dashboards/salesdata";
import Seo from "@/shared/layout-components/seo/seo";
import { useSelector } from "react-redux";
import Popup from "../../../../../components/Popup";

const Home = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.user);
  // console.log("auth id::   ", auth._id);
  const {
    reviews = [],
    posts,
    totalAccounts,
    todaysCount,
    account_stats,
  } = useSelector((state: any) => state.dash); // Default reviews to an empty array if undefined
  const [allCounts, setAllcounts] = useState<number>(0);
  const [percentage, setPercentage] = useState<any>({
    totalPercentage: 0,
    accountPercentage: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userName, setUserName] = useState<string>("");
  const [loginAttempt, setLoginAttempts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const recordsPerPage = 10;
  const loginAttemptData = useSelector((state: any) => state?.dash);

  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPost, setNewPost] = useState([]);
  const [updateId, setUpdate] = useState("");
  const [postPopup, setPostPopup] = useState(true);

  const currentReview = reviews?.[currentIndex] || null; // Ensure reviews is defined

  useEffect(() => {
    const interval = setInterval(() => {
      if (reviews.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length); // Safeguard against empty reviews array
      }
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [reviews.length]);

  useEffect(() => {
    fetchAccounts(1);
    getAllusersCount();
    getAllPosts();
    getAllReviews();
  }, []);

  useEffect(() => {
    getAllLoginAttempts();
    setUserName(auth?.userName);
  }, [auth, currentPage]);

  // Fetch accounts with pagination
  const fetchAccounts = async (page: number) => {
    const response = await getAccounts(auth?._id, page, 10, dispatch);
    setPercentage({
      ...percentage,
      accountPercentage: response?.percentageChange,
    });
  };


  const getAllusersCount = async () => {
    const { TotalUser, PercentageChange } = await getAlluserCount(dispatch);
    setAllcounts(TotalUser ?? 0);
    setPercentage({
      ...percentage,
      totalPercentage: PercentageChange,
    });
  };
  const getAllPosts = async () => {
    await getPosts(dispatch);
    await getSubscription(dispatch)
  };
  const getAllReviews = async () => {
    await getReviews(dispatch);
  };
  const getAllLoginAttempts = async () => {
    if (auth?.role == "admin") {
      await getGlobalLoginAttempts(
        { id: auth?._id, page: currentPage, limit: recordsPerPage },
        dispatch
      );
    } else if(auth?.role == 'basic'){
      await getLoginAttempts(
        { id: auth?._id, page: currentPage, limit: recordsPerPage },
        dispatch
      );
    }
    await getTodayuserCount(dispatch);
    await getAccountsStatistics(dispatch);
  };

  useEffect(() => {
    if (auth?.role == "basic") {
      if (loginAttemptData?.loginAttempts?.length) {
        setTotalRecords(loginAttemptData?.loginAttempts?.length);
        setLoginAttempts(loginAttemptData?.loginAttempts);
        setFilteredAttempts(loginAttemptData?.loginAttempts);
        setTotalPages(loginAttemptData?.totalPages);
      }
    } else if (auth?.role == "admin") {
      if (loginAttemptData?.globalLoginAttempts?.length) {
        setTotalRecords(loginAttemptData?.globalLoginAttempts?.length);
        setLoginAttempts(loginAttemptData?.globalLoginAttempts);
        setFilteredAttempts(loginAttemptData?.globalLoginAttempts);
        setTotalPages(loginAttemptData?.globaltotalPages);
      }
    }
  }, [loginAttemptData, auth]);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const getUserSubscriptionHistory = async () => {
    try {
      const histories = await getSubscriptionHistory([auth?._id], dispatch);
      if (histories) {
        console.log("Fetched subscription histories:", histories);
      } else {
        console.error("Failed to fetch subscription histories");
      }
    } catch (error) {
      console.error("Error while fetching subscription histories:", error);
    }
  };

  useEffect(() => {
    getUserSubscriptionHistory();
  }, []);

  return (
    <Fragment>
      <Seo title={"home"} />
      {/*  Start::page-header */}
      <div className="d-flex align-items-center justify-content-between my-4 page-header-breadcrumb flex-wrap gap-2 dark">
        <div>
          <p className="fw-medium fs-20 mb-0">{`Hello there, ${userName}`}</p>
          <p className="fs-13 text-muted mb-0">
            Let's make today a productive one!
          </p>
        </div>
      </div>
      <Row>
        <Col xxl={3} xl={3} lg={6} md={6} sm={6} className="col-12">
          <Card className="custom-card">
            <Card.Body className="p-4 h-[170px]">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <div>
                    <span className="d-block mb-2">Total users</span>
                    <h5 className="mb-4 fs-4">{allCounts}</h5>
                  </div>
                  <span className="text-success me-2 fw-medium d-inline-block">
                    <i className="ti ti-trending-up fs-5 align-middle me-1 d-inline-block"></i>
                    {percentage?.totalPercentage}%
                  </span>
                  <span className="text-muted">Since last month</span>
                </div>
                <div>
                  <div className="main-card-icon primary">
                    <div className="avatar avatar-lg bg-primary-transparent border border-primary border-opacity-10">
                      <div className="avatar avatar-sm svg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="#000000"
                          viewBox="0 0 256 256"
                        >
                          <path d="M216,64H176a48,48,0,0,0-96,0H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM128,32a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm88,168H40V80H80V96a8,8,0,0,0,16,0V80h64V96a8,8,0,0,0,16,0V80h40Z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3} xl={3} lg={6} md={6} sm={6} className="col-12">
          <Card className="custom-card main-card">
            <Card.Body className="p-4 h-[170px]">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <div>
                    <span className="d-block mb-2">Total Accounts</span>
                    <h5 className="mb-4 fs-4">{totalAccounts}</h5>
                  </div>
                  <span className="text-success me-2 fw-medium d-inline-block">
                    <i className="ti ti-trending-up fs-5 align-middle me-1 d-inline-block"></i>
                    {percentage?.accountPercentage}%
                  </span>
                  <span className="text-muted">than last month</span>
                </div>
                <div>
                  <div className="main-card-icon secondary">
                    <div className="avatar avatar-lg bg-secondary-transparent border border-secondary border-opacity-10">
                      <div className="avatar avatar-sm svg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="#000000"
                          viewBox="0 0 256 256"
                        >
                          <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,128H56a8,8,0,0,1-8-8V86.63A23.84,23.84,0,0,0,56,88H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,140Z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3} xl={3} lg={6} md={6} sm={6} className="col-12">
          <Card className="custom-card main-card">
            <Card.Body className="p-4 h-[170px]">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <div>
                    <span className="d-block mb-2">Online Users</span>
                    <h5 className="mb-4 fs-4">{todaysCount}</h5>
                  </div>
                </div>
                <div>
                  <div className="main-card-icon secondary">
                    <div className="avatar avatar-lg bg-secondary-transparent border border-secondary border-opacity-10">
                      <div className="avatar avatar-sm svg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="#000000"
                          viewBox="0 0 256 256"
                        >
                          <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,128H56a8,8,0,0,1-8-8V86.63A23.84,23.84,0,0,0,56,88H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,140Z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3} xl={3} lg={6} md={6} sm={6} className="col-12">
          <Card className="custom-card main-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <div>
                    <span className="d-block mb-2">Subscription expiry</span>
                    <h5 className="mb-4 fs-4">3 months</h5>
                  </div>
                  <span className="text-success me-2 fw-medium d-inline-block">
                    <i className="ti ti-trending-up fs-5 align-middle me-1 d-inline-block"></i>
                    0.29%
                  </span>
                  <span className="text-muted">Since last month</span>
                </div>
                <div>
                  <div className="main-card-icon success">
                    <div className="avatar avatar-lg bg-success-transparent border border-success border-opacity-10">
                      <div className="avatar avatar-sm svg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="#000000"
                          viewBox="0 0 256 256"
                        >
                          <path d="M200,168a48.05,48.05,0,0,1-48,48H136v16a8,8,0,0,1-16,0V216H104a48.05,48.05,0,0,1-48-48,8,8,0,0,1,16,0,32,32,0,0,0,32,32h48a32,32,0,0,0,0-64H112a48,48,0,0,1,0-96h8V24a8,8,0,0,1,16,0V40h8a48.05,48.05,0,0,1,48,48,8,8,0,0,1-16,0,32,32,0,0,0-32-32H112a32,32,0,0,0,0,64h40A48.05,48.05,0,0,1,200,168Z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={9}>
          <Card className="custom-card overflow-hidden sales-statistics-card">
            <Card.Header className="justify-content-between">
              <Card.Title>Accounts Statistics</Card.Title>
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  href="#!"
                  className="p-2 fs-12 text-muted no-caret border-0 d-inline"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {" "}
                  Sort By{" "}
                  <i className="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>{" "}
                </Dropdown.Toggle>
                <Dropdown.Menu role="menu">
                  <li>
                    <Dropdown.Item href="#!">This Week</Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item href="#!">Last Week</Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item href="#!">This Month</Dropdown.Item>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>

            <Card.Body className="position-relative p-0">
              <div id="sales-statistics">
                <ReactApexChart
                  options={Salesdata.Statistics2.options}
                  series={[{ name: "Accounts", data: account_stats }]}
                  type="line"
                  width={"100%"}
                  height={300}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header>
              <Card.Title>Reviews</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card className="mb-0 border-0 shadow-none bg-[#546dfe] overflow-hidden">
                <Card.Body className="p-4">
                  <p className="mb-3">"{currentReview?.content}"</p>
                  <div className="d-flex justify-content-between flex-wrap gap-3">
                    <div className="d-flex">
                      <img
                        src={
                          currentReview?.user?.avatar ||
                          "../../assets/images/faces/1.jpg"
                        }
                        alt="img"
                        className="avatar avatar-md avatar-rounded"
                      />
                      <div className="ms-2 my-auto mb-0">
                        <h6 className="mb-0 lh-1">{userName}</h6>
                        <p className="fs-14 mb-0">
                          {currentReview?.user?.role || "Client"}
                        </p>
                      </div>
                    </div>
                    {/* Uncomment below if you want to include ratings */}
                    {/* <div className="mb-0 text-warning fs-12 my-auto">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`ri-star${i < currentReview?.rating ? "-fill" : "-line"} me-1`}
                      ></i>
                    ))}
                  </div> */}
                  </div>
                </Card.Body>
              </Card>
              {/* <div className="row mt-0">
                <div className="col-6 border-end border-inline-end-dashed text-center">
                  <p className="text-muted mb-1 fs-12">This Month</p>
                  <h6 className="text-success">+74.83%</h6>
                </div>
                <div className="col-6 text-center">
                  <p className="text-muted mb-1 fs-12">Last Month</p>
                  <h6 className="text-primary">+56.90%</h6>
                </div>
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="flex justify-between">
              <Card.Title>News</Card.Title>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled recent-activity-list">
                {posts && posts?.length
                  ? posts?.map((post: any, index: any) => {
                      return (
                        <li key={index}>
                          <div>
                            <h6 className="mb-1 fs-13">
                              <div className="flex justify-between">
                                <div>
                                  {post && <span>{post?.title}</span>}
                                  <div className="mt-2">
                                    {post?.description}
                                  </div>
                                </div>
                                <span className="fs-11 text-muted float-end ">
                                  <div className="w-14">
                                    {moment(post?.createdAt).format("hh:mm A")}
                                  </div>
                                </span>
                              </div>
                            </h6>
                            <span className="d-block fs-13 text-muted fw-normal"></span>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>RECENT LOGINS</Card.Title>
              {/* <div className="d-flex flex-wrap gap-2">
                <div>
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Search Here"
                    aria-label=".form-control-sm example"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div> */}
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table text-nowrap">
                  <thead>
                    <tr>
                      {/* <th scope="row" className="ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabeljob1"
                          value=""
                          aria-label="..."
                        />
                      </th> */}
                      <th scope="col">Email</th>
                      <th scope="col">Username</th>
                      <th scope="col">Status</th>
                      <th scope="col">Description</th>
                      <th scope="col">Country</th>
                      <th scope="col">Country Code</th>
                      <th scope="col">Date</th>
                      <th scope="col" className="text-center">
                        Region
                      </th>
                      <th scope="col">City</th>
                      <th scope="col">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttempts && filteredAttempts?.length
                      ? filteredAttempts
                          ?.sort(
                            (a: any, b: any) =>
                              new Date(b.timestamp).getTime() -
                              new Date(a.timestamp).getTime()
                          )
                          ?.map((attempt: any) => (
                            <tr key={attempt._id}>
                              {/* <td className="ps-4">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`checkboxNoLabeljob_${attempt._id}`}
                                  value=""
                                  aria-label="..."
                                />
                              </td> */}
                              <td>
                                <div className="d-flex">
                                  <span className="avatar avatar-md mr-3">
                                    <img
                                      src={
                                        auth?.profileImage ??
                                        "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b"
                                      }
                                      className=""
                                      alt="..."
                                    />
                                  </span>
                                  <div className="ms-2">
                                    <p className="fw-semibold fs-13 mb-0 d-flex align-items-center">
                                      <Link scroll={false} href="#!">
                                        {attempt.userId?.email}{" "}
                                      </Link>
                                    </p>
                                    <p className="fs-12 text-muted mb-0">
                                      {attempt?.location?.city}
                                      {attempt?.location?.city &&
                                      attempt?.location?.region
                                        ? ", "
                                        : ""}
                                      {attempt?.location?.region}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>{attempt.userId?.userName}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    attempt?.status == "success"
                                      ? "bg-primary-transparent"
                                      : "bg-red-400"
                                  }`}
                                >
                                  {attempt.status}
                                </span>
                              </td>
                              <td>{attempt.description}</td>
                              <td>
                                <span className="d-block fw-semibold fs-13">
                                  {attempt.location?.country}
                                </span>
                              </td>
                              <td>{attempt.location?.countryCode}</td>
                              <td>
                                {new Date(
                                  attempt.timestamp
                                ).toLocaleDateString()}
                              </td>
                              <td className="text-center">
                                {attempt.location?.region}
                              </td>
                              <td className="fw-semibold">
                                {attempt.location?.city}
                              </td>
                              <td className="fw-semibold">
                                {attempt.location?.ipAddress}
                              </td>
                            </tr>
                          ))
                      : null}
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex align-items-center">
                <div>Showing {totalRecords} Entries</div>
                <div className="ms-auto">
                  <nav
                    aria-label="Page navigation"
                    className="pagination-style-4"
                  >
                    <Pagination className="pagination mb-0">
                      <Pagination.Item
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </Pagination.Item>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const startPage = Math.max(
                            Math.min(currentPage - 2, totalPages - 4),
                            1
                          );
                          const pageNumber = startPage + i;
                          return (
                            <Pagination.Item
                              key={pageNumber}
                              active={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </Pagination.Item>
                          );
                        }
                      )}

                      <Pagination.Item
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
};

export default Home;
