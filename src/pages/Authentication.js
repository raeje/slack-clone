import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getAllChannels, getAllUsers, login } from "../api";
import { getLocalUsers } from "../utils/Utils";
import "./Authentication.css";

const user1 = {
  email: "c2-2a@example.com",
  password: "12345678",
};
const user2 = {
  email: "c22a@example.com",
  password: "12345678",
};
const user3 = {
  email: "c22a-@example.com",
  password: "12345678",
  password_confirmation: "12345678",
};

const Authentication = () => {
  const [channels, setChannels] = useState([]);
  const [showDevLogin, setShowDevLogin] = useState(false);

  const devLoginClass = showDevLogin ? "display-block" : "display-none";

  const navigate = useNavigate();

  const handleLogin = async (user) => {
    const currentUser = await login(user);
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
    localUserData.channels = channelsList.data;
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
      console.log("auth channels", channels.data);
      navigate("/slack", { state: { channels: channelsList.data } });
    }
    console.log("Login done.");
  };
  /*
    const localUserData = {
    dms: [],
    channels: [],
  };
  const handleLogin = async (user) => {
    const userData = await login(user);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    console.log("auth user_headers", userData.headers);

    const usersList = await getAllUsers(userData.headers);

    const channelsList = await getAllChannels(userData.headers);
    localUserData.channels = channelsList.data;
    setChannels(channelsList);
    console.log("auth channelsList", channelsList.data);

    const stringifiedUsersListData = usersList.data.map((user) => {
      const userIdString = user.id.toString();
      return { id: userIdString, uid: user.uid };
    });
    console.log("auth usersList", usersList);
    localStorage.setItem("users", JSON.stringify(stringifiedUsersListData));

    if (userData) {
      //console.log("auth nav slack", channelsList.data);
      localStorage.setItem(
        userData.data.data.id.toString(),
        JSON.stringify(localUserData)
      );
      newLogin(user);
      navigate("/slack", { state: { channels: channelsList.data } });
    }

    setCurrentUser(userData);
  };
*/
  const handleDevButtonClick = () => {
    setShowDevLogin(!showDevLogin);
  };
  return (
    <section className="authentication-page">
      <button
        className="dev-login fa-brands fa-dev"
        onClick={handleDevButtonClick}
      />
      <div className={`dev-login-container ${devLoginClass}`}>
        <div className="dev-login-buttons">
          <button
            className="dev-login-button"
            onClick={() => handleLogin(user1)}
          >
            LOGIN USER 1
          </button>
          <button
            className="dev-login-button"
            onClick={() => handleLogin(user2)}
          >
            LOGIN USER 2
          </button>
          <button
            className="dev-login-button"
            onClick={() => handleLogin(user3)}
          >
            LOGIN USER 3
          </button>
        </div>
      </div>
      <div className="auth-greetings">
        <span className="greetings dark">
          Welcome to slack<span className="greetings subtle">-clone</span>
        </span>
      </div>
      <div className="auth-outlet-container">
        <div className="auth-outlet-links">
          <NavLink
            to={{ pathname: "login" }}
            className="auth-link login"
            key={"auth-link-login"}
            style={{ textDecoration: "none" }}
          >
            Login
          </NavLink>
          <NavLink
            to={{ pathname: "register" }}
            className="auth-link register"
            key={"auth-link-register"}
            style={{ textDecoration: "none" }}
          >
            Register
          </NavLink>
        </div>
        <Outlet />
      </div>
    </section>
  );
};

export default Authentication;
