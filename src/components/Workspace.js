import React from "react";
import { Outlet } from "react-router-dom";
import "./Workspace.css";

const Workspace = ({ setChannels }) => {
  return (
    <div className="workspace col-span-12 row-span-16">
      <Outlet />
    </div>
  );
};

export default Workspace;
