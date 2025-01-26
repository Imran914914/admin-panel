import React from "react";

const DashboardIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path
      d="M216,115.54V208a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54A8,8,0,0,1,216,115.54Z"
      opacity="0.2"
    ></path>
    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
  </svg>
);

const NestedmenuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="side-menu__icon"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <path d="M224,80l-96,56L32,80l96-56Z" opacity="0.2"></path>
    <path d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"></path>
  </svg>
);

const getUserRole = (): boolean => {
  const userRole = localStorage.getItem("UserRole");
  const finalRole = userRole ? JSON.parse(userRole) : null;
  console.log("finalRole in hee", finalRole);
  return finalRole === "basic"; // Adjust conditions as needed
};

export const MenuItems: any = [
  // {
  //   menutitle: "MAIN",
  // },

  {
    icon: DashboardIcon,
    badgetxt: "",
    title: "Dashboard",
    type: "sub",
    active: false,
    selected: false,
    children: [
      {
        path: "/dashboards/pricing",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Subscription",
      },
      {
        path: "/dashboards/high-scores",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "High Scores",
      },
      {
        path: "/dashboards/redeem-codes",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Redeem Codes",
      },
      {
        path: "/dashboards/chat-box",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Chat Box",
      },
    ],
  },

  {
    icon: NestedmenuIcon,
    title: "Tools",
    selected: false,
    active: false,
    type: "sub",
    children: [
      {
        path: "/dashboards/logs",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Logs",
      },
      {
        path: "/dashboards/urls",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Links",
      },
      {
        path: "/dashboards/Posts",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "News",
      },
      {
        path: "/dashboards/blocked-users",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Blocker",
      },
      {
        path: "/dashboards/user-managment",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "User Management",
      },
    ],
  },
];
