import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { createChannel, getAllChannels } from "../api";
import { SearchBar } from "../parts";
import { getCurrentUser } from "../utils/Utils";
import "./CreateChannel.css";

const CreateChannel = () => {
  const channelNameRef = useRef("");
  const currentUser = getCurrentUser();
  const [members, setMembers] = useState([]);

  const handleCreateChannel = async () => {
    const memberIds = members.map((member) => member.id);

    const apiResponse = await createChannel(
      channelNameRef.current.value,
      memberIds,
      currentUser.headers
    );

    if ("errors" in apiResponse.data) {
      console.log("cc cu.ch", apiResponse.data.errors);
    } else {
      //update currentUser.channels
      currentUser.channels.push(apiResponse.data.data);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  };

  const handleRemoveMember = (uid) => {
    setMembers(members.filter((member) => member.uid !== uid));
  };

  const renderMembers = () => {
    return members.map((member, index) => {
      return (
        <div
          className="channel-member-container"
          id={`member-${index}`}
          key={`member-${index}`}
        >
          <span className="member-uid">{member.uid}</span>
          <button
            className="channel-remove-member fa-solid fa-trash"
            id={`remove-member-${index}`}
            onClick={() => handleRemoveMember(member.uid)}
          ></button>
        </div>
      );
    });
  };

  return (
    <section className="create-channel-container outlet">
      <div className="outlet-header">
        <span className="receiver-uid">CREATE CHANNEL</span>
      </div>
      <div className="outlet-body">
        <label labelfor="channel-name">Channel name:</label>
        <input
          ref={channelNameRef}
          type="text"
          id="channel-name"
          className="channel-name"
        />
        <label labelfor="channel-members">Add a member:</label>
        <SearchBar
          componentId="create-channel-search"
          directMessages={members}
          setDirectMessages={setMembers}
        />
        <span className="create-channel-text">Members:</span>
        <div className="channel-members-container">{renderMembers()}</div>

        <button className="create-channel" onClick={handleCreateChannel}>
          CREATE
        </button>
      </div>
    </section>
  );
};

export default CreateChannel;
