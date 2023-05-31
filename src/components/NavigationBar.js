import React, { useState } from "react";
import "./NavigationBar.css";
import { NavLink } from "react-router-dom";
import { SearchBar, OutletLink } from "../parts";
import { getCurrentUser } from "../utils/Utils";

const NavigationBar = ({ directMessages, channels }) => {
  const currentUser = getCurrentUser();
  const [contacts, setContacts] = useState(directMessages);

  const renderDirectMessages = () => {
    return contacts.map((receiver, index) => {
      return (
        <OutletLink
          path={`/slack/direct-message`}
          type="User"
          key={receiver.id}
          linkId={receiver.id}
          name={receiver.uid}
          index={index}
        />
      );
    });
  };

  const renderCL = () => {
    return channels.map((channel, index) => {
      return (
        <OutletLink
          path={`/slack/channel`}
          type="Channel"
          linkId={channel.id}
          name={channel.name}
          index={index}
          key={channel.id}
        />
      );
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
  };

  return (
    <section className="nav-bar col-span-3 row-span-15 bg-slate-300">
      <div className="nav-section current-user">
        <span className="nav-section-name">Current user</span>
        <span className="current-user-info">{currentUser?.data.uid}</span>
        <span className="current-user-info">{currentUser?.data.id}</span>
      </div>
      <div className="nav-section channel-contact">
        <span className="nav-section-name">Contacts</span>
        <SearchBar
          componentId="add-contact"
          directMessages={contacts}
          setDirectMessages={setContacts}
        />
        {renderDirectMessages()}
      </div>
      <div className="nav-section channel-contact">
        <span className="nav-section-name">Channels</span>
        <NavLink
          to={{
            pathname: "/slack/create-channel",
          }}
          className="create-channel-link outlet-link fa-solid fa-plus nav-section-btn"
          style={{ textDecoration: "none" }}
        />
        {renderCL()}
      </div>
      {/*
      <div>
        <span className="nav-bar-section">Channels:</span>
        <div>{renderCL()}</div>
      </div>
      */}
      <NavLink
        to={{ pathname: "/" }}
        className="logout outlet-link"
        style={{ textDecoration: "none" }}
        onClick={handleLogout}
      >
        Logout
      </NavLink>
    </section>
  );
};

export default NavigationBar;
