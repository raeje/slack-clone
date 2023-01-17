import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { getMessage } from "../api";
import { getCurrentUser } from "../utils/Utils";

const DirectMessage = ({ receiverId, uid, index }) => {
  const [messages, setMessages] = useState([]);
  const currentUser = getCurrentUser();

  const handleClick = async () => {
    const msg = await getMessage({
      receiverId,
      currentUser,
      receiverClass: "User",
    });
    console.log("dm msg", msg);
    setMessages(msg);
    return msg;
  };

  useEffect(() => {
    (async () => {
      const data = await getMessage({
        receiverId,
        currentUser,
        receiverClass: "User",
      });
      setMessages(data);
    })();
  }, []);

  return (
    <NavLink
      to={{ pathname: `/slack/direct-message/${receiverId}` }}
      state={{ messages: messages, receiverId: receiverId, receiverUid: uid }}
      className="direct-message outlet-link"
      id={"dm" + index}
      key={"dm" + index}
      onClick={handleClick}
      style={{ textDecoration: "none" }}
    >
      {uid}
    </NavLink>
  );
};

export default DirectMessage;
