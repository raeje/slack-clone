import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getAllChannels, getAllUsers, login } from "../api";
import { getLocalUsers } from "../utils/Utils";

const AuthOutlet = ({ action }) => {
  const [channels, setChannels] = useState([]);
  const [notif, setNotif] = useState({});
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const navigate = useNavigate();

  const renderNotif = () => {
    return (
      <span className="auth-notification ">
        {notif.status} {notif.message}
      </span>
    );
  };

  const handleRegister = async () => {
    const apiResponse = await createUser({
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: confirmPasswordRef.current.value,
    });

    if (apiResponse.code === "ERR_BAD_REQUEST") {
      console.log("autho reg", apiResponse);
      const errorMessage =
        apiResponse.response.data.errors.full_messages.join(". ");
      setNotif({ status: "[ERROR]:", message: errorMessage });
      return;
    }
    setNotif({ status: "[SUCCESS]:", message: "User created" });
  };

  const handleLogin = async () => {
    const currentUser = await login({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    const currentUserId = currentUser.data.data.id.toString();
    const localUserData = {
      data: currentUser.data.data,
      headers: currentUser.headers,
    };
    navigate("/loading", {
      state: { header: "Log in successful!", message: "Please wait a moment." },
    });
    const updatedLocalUsers = {};
    const apiUsers = await getAllUsers(currentUser.headers);
    const oldLocalUsers = getLocalUsers() || {};
    const oldLocalUsersKeys = Object.keys(oldLocalUsers);

    const channelsList = await getAllChannels(currentUser.headers);
    localUserData.channels = channelsList.data || [];
    console.log("auth lud.ch", channels, localUserData.channels);
    setChannels(channelsList);

    if (apiUsers.data.length === oldLocalUsersKeys.length) {
      console.log("No new users.");
    }

    apiUsers.data.forEach((user) => {
      const userIdString = user.id.toString();
      const isOldUser = oldLocalUsersKeys.includes(userIdString);
      if (!isOldUser) {
        updatedLocalUsers[userIdString] = {
          uid: user.uid,
          contacts: [],
          channels: [],
        };
      } else {
        updatedLocalUsers[userIdString] = oldLocalUsers.userIdString;
      }
      if (userIdString === currentUserId) {
        const oldUserContacts = oldLocalUsersKeys.length
          ? []
          : oldLocalUsers.userIdString?.contacts;
        localUserData.contacts = oldUserContacts;
      }
    });

    localStorage.setItem("users", JSON.stringify(updatedLocalUsers));

    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(localUserData));
      navigate("/slack", { state: { channels: channelsList.data } });
    }
    console.log("Login done.");
  };

  const renderConfirmPassword = () => {
    if (action === "Register") {
      return (
        <>
          <label labelfor="auth-confirm-input">Confirm password:</label>
          <input
            ref={confirmPasswordRef}
            type="password"
            id="auth-confirm-input"
            className="auth-confirm-input auth-input"
            placeholder="confirm password"
          ></input>
        </>
      );
    }

    return;
  };

  const handleAction = action === "Register" ? handleRegister : handleLogin;

  return (
    <section className="auth-outlet">
      <div className="auth-form">
        <label labelfor="auth-email-input">Email:</label>
        <input
          ref={emailRef}
          type="text"
          id="auth-email-input"
          className="auth-email-input auth-input"
          placeholder="your-email@example.com"
        ></input>
        <label labelfor="auth-password-input">Password:</label>
        <input
          ref={passwordRef}
          type="password"
          id="auth-password-input"
          className="auth-password-input auth-input"
          placeholder="secure password"
        ></input>
        {renderConfirmPassword()}
      </div>
      <div className="auth-action-container">
        <button className="auth-action" onClick={() => handleAction()}>
          {action}
        </button>
        {renderNotif()}
      </div>
    </section>
  );
};

export default AuthOutlet;
