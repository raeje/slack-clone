import React, { useState } from "react";
import { NavigationBar, Workspace } from "../components";
import { getCurrentUser } from "../utils/Utils";
import { Outlet } from "react-router-dom";
import "./Messenger.css";

const Messenger = () => {
  const [directMessages, setDirectMessages] = useState([
    { id: "3096", uid: "c22a@example.com" },
    { id: "3097", uid: "c2-2a@example.com" },
    { id: "3098", uid: "c22a-@example.com" },
  ]);

  const currentUser = getCurrentUser();
  const [channels, setChannels] = useState(currentUser.channels);

  console.log("msg cu", currentUser);
  //const localUserData = getLocalUserData(currentUser.data.id);

  return (
    <div className="messenger-body w-screen h-screen grid grid-cols-16 grid-rows-16">
      <NavigationBar directMessages={directMessages} channels={channels} />
      {
        //<Workspace setChannels={setChannels} />
      }
      <Outlet context={[channels, setChannels]} />
    </div>
  );
};

export default Messenger;
