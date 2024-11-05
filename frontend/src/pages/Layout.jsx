import React from "react";

import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="">
        <div className="">
          <Sidebar />
        </div>
        <div className="flex items-center justify-center w-full h-screen">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
