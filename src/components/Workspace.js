import React from "react";
import { Outlet } from "react-router-dom";
import "./Workspace.css";

const Workspace = () => {
  return (
    <div className="workspace col-span-12 row-span-16">
      <Outlet />
    </div>
  );
};
/*
      {users.forEach((user) => (
        <div>user</div>
      ))}
*/
export default Workspace;
