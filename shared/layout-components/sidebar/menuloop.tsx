import { ThemeChanger } from "@/shared/redux/action";
import Link from "next/link";
import { Fragment } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect, useSelector } from "react-redux";

function Menuloop({
  local_varaiable,
  MenuItems,
  toggleSidemenu,
  level,
  HoverToggleInnerMenuFn,
}: any) {
  const user = useSelector((state: any) => state.auth.user);
  const handleMainClick = (event: any) => {
    // Open the menu on click
    toggleSidemenu(event, MenuItems);
  };

  const filterMenuItems = (children: any) => {
    // console.log('user in here', user)
    if (user?.role?.toLowerCase() === "basic") {
      return children.filter(
        (item: any) => item.title !== "User Management" && item.title !== "News"
      );
    }
    return children;
  };

  return (
    <Fragment>
      <Link
        href={MenuItems.title === "Dashboard" ? "/dashboards/home" : ""}
        scroll={false}
        className={`side-menu__item ${MenuItems?.selected ? "active" : ""}`}
        onClick={(event) => handleMainClick(event)} // Custom handler for main click
        onMouseEnter={(event) => HoverToggleInnerMenuFn(event, MenuItems)}
      >
        <i className="ri-arrow-down-s-line side-menu__angle"></i>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="button-tooltip">{MenuItems.title}</Tooltip>}
        >
          <div
            className={`${
              local_varaiable?.dataVerticalStyle === "doublemenu"
                ? ""
                : "d-none"
            }`}
          >
            {MenuItems.icon}
          </div>
        </OverlayTrigger>
        {local_varaiable?.dataVerticalStyle !== "doublemenu"
          ? MenuItems.icon
          : ""}
        <span className={`${level === 1 ? "side-menu__label" : ""}`}>
          {MenuItems.title}
          {MenuItems.badgetxt ? (
            <span className={MenuItems.class}>{MenuItems.badgetxt}</span>
          ) : (
            ""
          )}
        </span>
      </Link>
      <ul
        className={`slide-menu child${level} ${
          MenuItems.active ? "double-menu-active" : ""
        } ${MenuItems?.dirchange ? "force-left" : ""}`}
        style={MenuItems.active ? { display: "block" } : { display: "none" }}
      >
        {level <= 1 ? (
          <li className="slide side-menu__label1">
            <Link href="#!" scroll={false}>
              {MenuItems.title}
            </Link>
          </li>
        ) : (
          ""
        )}
        {filterMenuItems(MenuItems.children)?.map(
          (firstlevel: any, index: any) => (
            <li
              className={`${firstlevel.menutitle ? "slide__category" : ""} ${
                firstlevel?.type === "empty" ? "slide" : ""
              } ${firstlevel?.type === "link" ? "slide" : ""} ${
                firstlevel?.type === "sub" ? "slide has-sub" : ""
              } ${firstlevel?.active ? "open" : ""} ${
                firstlevel?.selected ? "active" : ""
              }`}
              key={index}
            >
              {firstlevel.type === "link" ? (
                <Link
                  href={firstlevel.path}
                  className={`side-menu__item ${
                    firstlevel.selected ? "active" : ""
                  }`}
                >
                  {firstlevel.icon}
                  <span className="">
                    {firstlevel.title}
                    {firstlevel.badgetxt ? (
                      <span className={firstlevel.class}>
                        {firstlevel.badgetxt}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </Link>
              ) : (
                ""
              )}
              {firstlevel.type === "empty" ? (
                <Link
                  href="#!"
                  className="side-menu__item"
                  onClick={handleMainClick}
                >
                  {firstlevel.icon}
                  <span className="">
                    {firstlevel.title}
                    {firstlevel.badgetxt ? (
                      <span className={firstlevel.class}>
                        {firstlevel.badgetxt}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </Link>
              ) : (
                ""
              )}
              {firstlevel.type === "sub" ? (
                <Menuloop
                  MenuItems={firstlevel}
                  toggleSidemenu={toggleSidemenu}
                  HoverToggleInnerMenuFn={HoverToggleInnerMenuFn}
                  level={level + 1}
                />
              ) : (
                ""
              )}
            </li>
          )
        )}
      </ul>
    </Fragment>
  );
}

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Menuloop);
