import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllChannels, login } from "../api";
import { NavigationBar, Header, Workspace } from "../components";
import { getCurrentUser, getLocalUserData } from "../utils/Utils";
import "./Messenger.css";

const Messenger = () => {
  //const [users, setUsers] = useState([]);
  //const [currentUser, setCurrentUser] = useState("");
  const [directMessages, setDirectMessages] = useState([
    { id: "3096", uid: "c22a@example.com" },
    { id: "3097", uid: "c2-2a@example.com" },
    { id: "3098", uid: "c22a-@example.com" },
  ]);

  const currentUser = getCurrentUser();

  console.log("msg cu", currentUser);
  //const localUserData = getLocalUserData(currentUser.data.id);

  return (
    <div className="messenger-body w-screen h-screen grid grid-cols-16 grid-rows-16">
      <NavigationBar
        directMessages={directMessages}
        channels={currentUser.channels}
      />
      <Workspace />
    </div>
  );
};

export default Messenger;
