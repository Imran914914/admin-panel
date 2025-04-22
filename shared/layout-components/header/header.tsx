"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { connect, useSelector, useDispatch } from "react-redux";
import store from "@/shared/redux/store";
import {
  Button,
  Dropdown,
  InputGroup,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { MenuItems } from "../sidebar/nav";
import nextConfig from "@/next.config.mjs";
import { LOGIN_FAILURE, LOGOUT } from "@/shared/redux/types";
import { userInfo } from "os";
import {
  deleteNotifications,
  getNotifications,
  ThemeChanger,
} from "@/shared/Api/dashboard";
import { editProfile } from "@/shared/Api/auth";
const Header = ({ local_varaiable }: any) => {
  const dispatch = useDispatch();
  let { basePath } = nextConfig;
  const theme = useSelector((state: any) => state.theme);
  const notifications = useSelector((state: any) => state.dash.notifications);
  const user = useSelector((state: any) => state.auth.user);
  const [notification, setNotification] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleToggle = () => {
    setProfileShow(!profileShow); // Toggle the dropdown state
  };

  const handleDropdownClose = () => {
    setProfileShow(false); // Close the dropdown
  };

  const getNotificationslocal = async () => {
    await getNotifications(dispatch);
  };

  const handleNotificationClose = async (index: number, event: any) => {
    console.log("event.id:  ",event?.id)
    await deleteNotifications({ id: event?.id }, dispatch);
    const updatedNotifications = notifications.splice(index, 1);
    setNotification(updatedNotifications);
  };
  //full screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    };
  }, []);

  //Endfull screen

  ///handleResize
  function menuClose() {
    const { theme } = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, toggled: "close" }, dispatch);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const windowObject = window;
      if (windowObject.innerWidth <= 991) {
      } else {
      }
    };
    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  ///End handleResize

  const toggleSidebar = () => {
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            console.log("this one got called");
            ThemeChanger({ ...theme, dataNavStyle: "" }, dispatch);
            if (theme.toggled === "close-menu-close") {
              console.log("this one got called if");
              ThemeChanger({ ...theme, toggled: "" }, dispatch);
            } else {
              ThemeChanger({ ...theme, toggled: "close-menu-close" }, dispatch);
            }
            break;
          // icon-overlay
          case "overlay":
            console.log("this one got called");
            ThemeChanger({ ...theme, dataNavStyle: "" }, dispatch);
            if (theme.toggled === "icon-overlay-close") {
              ThemeChanger(
                { ...theme, toggled: "", iconOverlay: "" },
                dispatch
              );
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger(
                  {
                    ...theme,
                    toggled: "icon-overlay-close",
                    iconOverlay: "",
                  },
                  dispatch
                );
              }
            }
            break;
          // icon-text
          case "icontext":
            console.log("this one got called");
            ThemeChanger({ ...theme, dataNavStyle: "" }, dispatch);
            if (theme.toggled === "icon-text-close") {
              ThemeChanger({ ...theme, toggled: "" }, dispatch);
            } else {
              ThemeChanger({ ...theme, toggled: "icon-text-close" }, dispatch);
            }
            break;
          // doublemenu
          case "doublemenu":
            console.log("this one got called");
            ThemeChanger({ ...theme, dataNavStyle: "" }, dispatch);
            ThemeChanger({ ...theme, dataNavStyle: "" }, dispatch);
            if (theme.toggled === "double-menu-open") {
              ThemeChanger(
                { ...theme, toggled: "double-menu-close" },
                dispatch
              );
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger(
                  { ...theme, toggled: "double-menu-open" },
                  dispatch
                );
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                } else {
                  ThemeChanger(
                    { ...theme, toggled: "double-menu-close" },
                    dispatch
                  );
                  // ThemeChanger({ ...theme, "toggled": "" });
                }
              }
            }
            // doublemenu(ThemeChanger);
            break;
          // detached
          case "detached":
            if (theme.toggled === "detached-close") {
              ThemeChanger(
                { ...theme, toggled: "", iconOverlay: "" },
                dispatch
              );
            } else {
              ThemeChanger(
                {
                  ...theme,
                  toggled: "detached-close",
                  iconOverlay: "",
                },
                dispatch
              );
            }

            break;

          // default
          case "default":
            console.log("this one got called default");
            ThemeChanger({ ...theme, toggled: "" }, dispatch);
        }
        switch (navStyle) {
          case "menu-click":
            console.log("this one got called");
            if (theme.toggled === "menu-click-closed") {
              ThemeChanger({ ...theme, toggled: "" }, dispatch);
            } else {
              ThemeChanger(
                { ...theme, toggled: "menu-click-closed" },
                dispatch
              );
            }
            break;
          // icon-overlay
          case "menu-hover":
            console.log("this one got called");
            if (theme.toggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" }, dispatch);
            } else {
              ThemeChanger(
                { ...theme, toggled: "menu-hover-closed" },
                dispatch
              );
            }
            break;
          case "icon-click":
            console.log("this one got called");
            if (theme.toggled === "icon-click-closed") {
              ThemeChanger({ ...theme, toggled: "" }, dispatch);
            } else {
              ThemeChanger(
                { ...theme, toggled: "icon-click-closed" },
                dispatch
              );
            }
            break;
          case "icon-hover":
            console.log("this one got called");
            if (theme.toggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, toggled: "" }, dispatch);
            } else {
              ThemeChanger(
                { ...theme, toggled: "icon-hover-closed" },
                dispatch
              );
            }
            break;
        }
      }
    } else {
      if (theme.toggled === "close") {
        console.log("this one got called");
        ThemeChanger({ ...theme, toggled: "open" }, dispatch);

        setTimeout(() => {
          if (theme.toggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        console.log("this one got called final");
        ThemeChanger({ ...theme, toggled: "close" }, dispatch);
      }
    }
  };

  // Toggle Dark
  const logOut = async() => {
    const response = await editProfile({
      ...user,
      is2FAverified:false
    },dispatch)
    dispatch({ type: LOGOUT });
  };
  // End Toggle Dark

  useEffect(() => {
    const navbar = document?.querySelector(".header");
    const navbar1 = document?.querySelector(".app-sidebar");
    const sticky: any = navbar?.clientHeight;
    // const sticky1 = navbar1.clientHeight;

    function stickyFn() {
      if (window.pageYOffset >= sticky) {
        navbar?.classList.add("sticky-pin");
        navbar1?.classList.add("sticky-pin");
      } else {
        navbar?.classList.remove("sticky-pin");
        navbar1?.classList.remove("sticky-pin");
      }
    }

    window.addEventListener("scroll", stickyFn);
    window.addEventListener("DOMContentLoaded", stickyFn);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener("scroll", stickyFn);
      window.removeEventListener("DOMContentLoaded", stickyFn);
    };
  }, []);

  //Switcher
  const Switchericon = () => {
    document.querySelector(".offcanvas-end")?.classList.toggle("show");
    if (
      document.querySelector(".switcher-backdrop")?.classList.contains("d-none")
    ) {
      document.querySelector(".switcher-backdrop")?.classList.add("d-block");
      document.querySelector(".switcher-backdrop")?.classList.remove("d-none");
    }
  };

  //Search Functionality

  //Media screen Modal

  //End Media screen Modal
  return (
    <Fragment>
      <header className="app-header sticky" id="header">
        {/* Start::main-header-container */}
        <div className="main-header-container container-fluid">
          {/* Start::header-content-left */}
          <div className="header-content-left">
            {/* Start::header-element */}
            <div className="header-element">
              <div className="horizontal-logo">
                <Link
                  scroll={false}
                  href="/dashboards/home"
                  className="header-logo"
                >
                  <img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/brand-logos/desktop-logo.png`}
                    alt="logo"
                    className="desktop-logo"
                  />
                  <img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/brand-logos/toggle-logo.png`}
                    alt="logo"
                    className="toggle-logo"
                  />
                  <img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/brand-logos/desktop-dark.png`}
                    alt="logo"
                    className="desktop-dark"
                  />
                  <img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/brand-logos/toggle-dark.png`}
                    alt="logo"
                    className="toggle-dark"
                  />
                </Link>
              </div>
            </div>
            {/* End::header-element */}

            {/* Start::header-element */}
            {/* <div
              className="header-element mx-lg-0 mx-2 cursor-pointer "
              onClick={() => toggleSidebar()}
            >
              <Link
                scroll={false}
                aria-label="Hide Sidebar"
                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
                data-bs-toggle="sidebar"
                href="#!"
              >
                <span></span>
              </Link>
            </div> */}
          </div>

          <ul className="header-content-right">
            <li className="header-element d-md-none d-block">
              <Link
                onClick={handleShow}
                scroll={false}
                href="#!"
                className="header-link"
                data-bs-toggle="modal"
                data-bs-target="#header-responsive-search"
              >
                <i className="bi bi-search header-link-icon lh-1"></i>
              </Link>
            </li>

            <Dropdown
              className="header-element notifications-dropdown d-xl-block d-none dropdown"
              onToggle={(isOpen) => {
                if (isOpen) {
                  getNotificationslocal(); // Call the function when dropdown opens
                }
              }}
            >
              <Dropdown.Toggle
                variant=""
                className="header-link dropdown-toggle no-caret"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                id="messageDropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-link-icon animate-bell"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,139.81,56,104a72,72,0,0,1,144,0c0,35.82,8.3,64.6,14.9,76A8,8,0,0,1,208,192Z"
                    opacity="0.1"
                  ></path>
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                </svg>
                <span className="header-icon-pulse bg-secondary rounded pulse pulse-secondary"></span>
              </Dropdown.Toggle>

              <Dropdown.Menu
                align="end"
                as="ul"
                className="main-header-dropdown dropdown-menu-end"
                data-popper-placement="none"
              >
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-16">Notifications</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>

                {/* Add max-height and overflow-y for scroll */}
                <ul
                  className="list-unstyled mb-0"
                  id="header-notification-scroll"
                  style={{
                    maxHeight: "300px", // Adjust the height as needed
                    overflowY: "auto", // Enable vertical scrolling
                  }}
                >
                  {notifications?.map((idx: any, index: any) => (
                    <Dropdown.Item
                      as="li"
                      className="dropdown-item"
                      key={Math.random()}
                    >
                      <div className="d-flex align-items-center">
                        <div className="pe-2 lh-1">
                          <span
                            className={`avatar avatar-md avatar-rounded bg-${idx?.color}`}
                          >
                            <i className={idx?.icon}></i>
                          </span>
                        </div>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-0 fw-medium">
                              <Link scroll={false} href="#!">
                                {idx?.title}
                              </Link>
                            </p>
                            <div className="text-muted fw-normal fs-12 header-notification-text text-truncate">
                              {idx?.message}
                              <span className={idx?.class}>{idx?.text2}</span>
                              {idx?.text3}
                            </div>
                          </div>
                          <div>
                            <button
                              className="min-w-fit-content text-muted dropdown-item-close1"
                              onClick={(event) =>
                                handleNotificationClose(index, idx)
                              }
                            >
                              <i className="ri-close-circle-line fs-5"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                </ul>

                <div
                  className={`p-3 empty-header-item1 border-top ${
                    notifications?.length === 0 ? "d-none" : "d-block"
                  }`}
                >
                  <div className="d-grid">
                    <Link
                      scroll={false}
                      href="/notifications"
                      className="btn btn-primary btn-wave"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                <div
                  className={`p-5 empty-item1 ${
                    notifications?.length === 0 ? "d-block" : "d-none"
                  }`}
                >
                  <div className="text-center">
                    <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                      <i className="ri-notification-off-line fs-2"></i>
                    </span>
                    <h6 className="fw-medium mt-3">No New Notifications</h6>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
            <li className="header-element header-fullscreen">
              <Link
                scroll={false}
                // onclick="openFullscreen();"
                href="#!"
                className="header-link"
                onClick={() => toggleFullscreen()}
              >
                {isFullscreen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="full-screen-close header-link-icon "
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M208,48V96L160,48ZM48,208H96L48,160Z"
                      opacity="0.1"
                    ></path>
                    <path d="M208,40H160a8,8,0,0,0-5.66,13.66L172.69,72l-34.35,34.34a8,8,0,0,0,11.32,11.32L184,83.31l18.34,18.35A8,8,0,0,0,216,96V48A8,8,0,0,0,208,40Zm-8,36.69L179.31,56H200Zm-93.66,61.65L72,172.69,53.66,154.34A8,8,0,0,0,40,160v48a8,8,0,0,0,8,8H96a8,8,0,0,0,5.66-13.66L83.31,184l34.35-34.34a8,8,0,0,0-11.32-11.32ZM56,200V179.31L76.69,200Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className=" full-screen-open header-link-icon"
                    width="32"
                    height="32"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M208,48V88L168,48ZM48,208H88L48,168Zm160,0V168l-40,40ZM48,88,88,48H48Z"
                      opacity="0.1"
                    ></path>
                    <path d="M208,40H168a8,8,0,0,0-5.66,13.66l40,40A8,8,0,0,0,216,88V48A8,8,0,0,0,208,40Zm-8,28.69L187.31,56H200ZM53.66,162.34A8,8,0,0,0,40,168v40a8,8,0,0,0,8,8H88a8,8,0,0,0,5.66-13.66ZM56,200V187.31L68.69,200Zm155.06-39.39a8,8,0,0,0-8.72,1.73l-40,40A8,8,0,0,0,168,216h40a8,8,0,0,0,8-8V168A8,8,0,0,0,211.06,160.61ZM200,200H187.31L200,187.31ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,88,40ZM56,68.69V56H68.69Z"></path>
                  </svg>
                )}
              </Link>
            </li>
            <Dropdown
              className="header-element dropdown custom-dropdown"
              show={profileShow}
              onToggle={handleToggle}
            >
              <Dropdown.Toggle
                variant=""
                href="#!"
                className="header-link dropdown-toggle no-caret"
                id="mainHeaderProfile"
                data-bs-auto-close="outside"
                aria-expanded={show}
                onClick={handleToggle}
              >
                <div className="d-flex align-items-center">
                  <div className="me-xl-2 me-0">
                    <img
                      src={
                        user?.profileImage ??
                        "https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/images%2Favatar.png?alt=media&token=6b910478-6e58-4c73-8ea9-f4827f2eaa1b"
                      }
                      alt="img"
                      className="avatar avatar-sm avatar-rounded"
                    />
                  </div>
                  <div className="d-xl-block d-none lh-1">
                    <span className="fw-medium lh-1">{user?.userName}</span>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu
                as="ul"
                className="main-header-dropdown pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
                aria-labelledby="mainHeaderProfile"
              >
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="/dashboards/profile"
                    onClick={handleDropdownClose}
                  >
                    <i className="ti ti-user me-2 fs-18 text-primary"></i>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="/dashboards/edit-profile"
                    onClick={handleDropdownClose}
                  >
                    <i className="ti ti-settings me-2 fs-18 text-orange"></i>
                    Settings
                  </Link>
                </li>
                <li>
                  <div
                    className="dropdown-item d-flex align-items-center cursor-pointer"
                    onClick={() => {
                      logOut();
                      handleDropdownClose();
                    }}
                  >
                    <i className="ti ti-logout me-2 fs-18 text-warning"></i>Log
                    Out
                  </div>
                </li>
              </Dropdown.Menu>
            </Dropdown>

            <li className="header-element">
              <Link
                scroll={false}
                href="/dashboards/edit-profile"
                className="header-link switcher-icon"
                data-bs-toggle="offcanvas"
                data-bs-target="#switcher-canvas"
                // onClick={() => Switchericon()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-link-icon"
                  width="32"
                  height="32"
                  fill="#000000"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
                    opacity="0.1"
                  ></path>
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.1,8.1,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8,8,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z"></path>
                </svg>
              </Link>
              {/* End::header-link|switcher-icon */} 
            </li>
            {/* End::header-element */} 
          </ul>
          {/* End::header-content-right */}
        </div>
        {/* End::main-header-container  */}
      </header>
      <Modal
        show={show}
        onHide={handleClose}
        className="modal fade"
        id="header-responsive-search"
        tabIndex={-1}
        aria-labelledby="header-responsive-search"
        aria-hidden="true"
      >
        <Modal.Body className="">
          <InputGroup className="flex-wrap header-search">
            <input
              type="text"
              className="form-control border-end-0"
              placeholder="Search Anything ..."
              aria-label="Search Anything ..."
              aria-describedby="button-addon2"
              autoCapitalize="off"
            />
            <Button
              variant=""
              className="btn btn-primary"
              type="button"
              id="button-addon2"
            >
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default Header;
