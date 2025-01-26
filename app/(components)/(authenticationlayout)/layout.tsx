import Switcher from "@/shared/layout-components/switcher/switcher";
import React, { Fragment } from "react";

const Authenticationlayout = ({ children }: any) => {
  return (
    <Fragment>
      <Switcher />
      {children}
    </Fragment>
  );
};

export default Authenticationlayout;
