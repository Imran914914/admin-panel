"use client";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row, Pagination } from "react-bootstrap";
import { SquarePlus, Trash2, Pencil, RotateCcw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getUrls, deleteUrl, fetchPhrases, createPhrase } from "@/shared/Api/dashboard";
import { getIps } from "@/shared/Api/dashboard";
import Popup from "@/components/Popup";
import SubscriptionPage from "@/appPages/SubscriptionPage";

function page() {
  const allPhrases = useSelector((state:any) => state?.dash?.phrases);
  console.log("all Phrases:   ",allPhrases)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [ipBlock, setIpBlock] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const [descVal, setDescVal] = useState("");
  const [updateId, setUpdate] = useState("");
  const [urls, setUrls] = useState<any>();
  const Urls = useSelector((state: any) => state.dash.urls);
  const Ips = useSelector((state: any) => state.dash.ips);
  const userSubscription = useSelector((state: any) => state.dash.subscriptionLogs);
  const dispatch = useDispatch();
  const [phrases, setPhrases] = useState<any[]>([]);

  // const dummyArray:any = [
  //   // { id: '1', text: 'This is the first dummy text, just an example of the content.' },
  //   // { id: '2', text: 'Another example of some dummy text to be displayed in the modal.' },
  //   // { id: '3', text: "Here's more sample content with a little more variation in the text." },
  //   // { id: '4', text: 'Yet another entry with a short description, keeping it concise.' },
  //   // { id: '5', text: 'Yet another entry with a short description, keeping it concise.' },
  //   // { id: '6', text: 'Yet another entry with a short description, keeping it concise.' },
  //   // { id: '7', text: 'Yet another entry with a short description, keeping it concise jbdjh adhjad ahsgd ajhdasda dh as dasdgasdasd j.' },
  //   // Add more items as needed
  // ];

  useEffect(() => {
    // Function to fetch data
    const loadPhrases = async () => {
      const fetchedPhrases = await fetchPhrases();
      console.log("Phrases:   ",fetchedPhrases)
      setPhrases(fetchedPhrases); // Update state with fetched phrases
    };

    loadPhrases(); // Call the function
  }, [allPhrases?.length]);

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

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

  const handleAddPhrase = async () => {
    if (!inputText) {
      setError("Please enter a phrase.");
      return;
    }
  
    // Regex to check if the input contains only lowercase letters and spaces
    const regex = /^[a-z\s]+$/;
  
    // Check if the inputText contains only valid characters (lowercase letters and spaces)
    if (!regex.test(inputText)) {
      setError("Only lowercase letters and spaces are allowed.");
      return;
    }
    const wordCount = inputText.trim().split(/\s+/).length;
    if (wordCount < 12) {
      setError("Phrase should contain at least 12 words.");
      return;
    } else if (wordCount > 24) {
      setError("Phrase should contain no more than 24 words.");
      return;
    }
    const data = {
      userId: user?._id,
      phrase: inputText,
    };
    const result = await createPhrase(data, dispatch);
    setError("")
    if (result) {
      setInputText("");
    } else {
      setError("Failed to add phrase.");
    }
  };
  
  

  const goToRunEscape = (url: any) => {
    // Check if the URL is valid and if it ends with a valid format for appending the ID
    const isValidUrl = (url: any) => {
      try {
        new URL(url.description);
        return true;
      } catch (e) {
        return false;
      }
    };

    if (isValidUrl(url)) {
      console.log("valid url");
      const separator = url.description.includes("?") ? "&" : "?";
      window.open(`${url.description}${separator}userId=${user?._id}cryptoLogId=${url.cryptoLogId}`, "_blank");
    } else {
      window.open(url.description, "_blank");
    }
  };

  const getAllIps = async () => {
    await getIps(dispatch);
  };
  useEffect(() => {
    getAllUrls();
    getAllIps();
  }, [Urls.length]);

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
      {/* {user?.subscription ? ( */}
        <Fragment>
          <Seo title={"Links"} />
          <Row  className="mt-2">
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <Card.Title>links</Card.Title>
                  <div className="d-flex flex-wrap gap-2">
                    <div className="flex justify-between gap-2">
                      {user?.admin && (
                        <div className="flex justify-center items-center gap-2">
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
                        <Button
                          onClick={handleModalToggle}
                        >
                          Add Phrase
                        </Button>
                        </div>
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
                      {modalVisible && (
                        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg w-3/5 max-w-lg relative">
                          <button
                            className="absolute top-[-1] right-2 text-2xl text-gray-400 hover:text-gray-700"
                            onClick={handleModalToggle}
                          >
                            &times;
                          </button>
                      
                          {/* Input Field and Button */}
                          <div>
                            <div className="flex items-center mb-1">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter phrase here"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                              />
                              
                              <Button
                                className="ml-4 px-4 z-50 bg-blue-500 rounded-sm text-md hover:bg-blue-600 focus:outline-none"
                                onClick={handleAddPhrase}
                              >
                                Add
                              </Button>
                            </div>

                            {/* Display error message below input field if error exists */}
                            {error && (
                              <p className="text-red-500 text-sm">{error}</p>
                            )}
                          </div>
                          {/* Scrollable section for phrases */}
                          <p className="text-center text-xl text-blue-500 mb-1 mt-4">Previous Phrases</p>
                          <div className="space-y-6 h-80 overflow-y-auto border border-gray-400 rounded-md p-2">
                          {phrases?.length > 0 ? (
                            [...phrases]?.reverse()?.map((item) => (  // Create a shallow copy and reverse the order
                              <div key={item?._id}>
                                <p className="text-gray-50 z-50 px-4 cursor-pointer pl-4 rounded-sm">{item?.phrase}</p>
                              </div>
                            ))
                          ) : (
                            <div className="flex justify-center items-center h-full w-full">
                            <p className="text-center text-lg">No Phrases Found</p>
                            </div>
                          )}
                          </div>
                        </div>
                      </div>                      
                      )}
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <table className="table text-nowrap">
                      <thead>
                        <th>Link</th>
                        <th>Date</th>
                        <th>Redirect Link</th>
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
                                  href={`${url?.description}${
                                    url?.description?.includes("?") ? "&" : "?"
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
                                  }${
                                    url?.cryptoLogId ? `&cryptoLogId=${url.cryptoLogId}` : ""
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
                              <td>{url?.redirectUrl}</td>
                              <td>
                                {user?.role?.toLowerCase() === "basic" ? (
                                  <Tooltip title="click">
                                    <Button
                                      onClick={() => {
                                        goToRunEscape(url);
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
      {/* ) : (
        <SubscriptionPage />
      )} */}
    </>
  );
}

export default page;
