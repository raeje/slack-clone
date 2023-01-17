import React, { useState } from "react";
import { addUser } from "../api";
import { getCurrentUser } from "../utils/Utils";
import "./ChannelInfoModal.css";
import SearchBar from "./SearchBar";

const ChannelInfoModal = ({
  name,
  id,
  members,
  isModalVisible,
  setIsModalVisible,
}) => {
  const handleClose = () => {
    setIsModalVisible(!isModalVisible);
  };
  const [newMembers, setNewMembers] = useState([]);
  const currentUser = getCurrentUser();

  const modalClass = isModalVisible
    ? "channel-info-modal-container display-block"
    : "channel-info-modal-container display-none";

  const membersUid = members.map((member) => {
    return member.uid;
  });

  const handleRemoveMember = (uid) => {
    setNewMembers(newMembers.filter((member) => member.uid !== uid));
  };

  const handleAddUser = () => {
    const newUsersId = newMembers.map((user) => user.id);

    newUsersId.forEach((userId) => {
      const apiResponse = addUser({
        memberId: userId,
        channelId: id,
        currentUser: currentUser.headers,
      });

      console.log("cim addUser response", apiResponse.data);
    });
    setNewMembers([]);
  };

  const renderMembers = () => {
    return newMembers.map((member, index) => {
      return (
        <div
          className="channel-new-member-container"
          id={`new-member-${index}`}
          key={`new-member-${index}`}
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
    <div className={modalClass}>
      <section className="channel-info-modal-body">
        <button
          className="channel-info-modal-close fa-solid fa-xmark"
          onClick={handleClose}
        ></button>

        <div className="modal-header">
          <h3>Add members</h3>
        </div>
        <div className="channel-info-modal-notif">Notifications</div>

        <div className="channel-info">
          <span className="channel-info-label">Channel name:</span>
          <span className="channel-info-value">{name}</span>
        </div>
        <div className="channel-info">
          <span className="channel-info-label">Current members:</span>
          <div className="members-container">{membersUid.join(", ")}</div>
        </div>
        <SearchBar
          componentId="channel-new-member"
          directMessages={members}
          setDirectMessages={setNewMembers}
        />
        <div className="new-members-container">
          <span className="channel-info-label">New members:</span>
          <div className="channel-new-members-container">{renderMembers()}</div>
        </div>
        <div className="add-new-channel-members-container">
          <button className="add-new-channel-members " onClick={handleAddUser}>
            ADD
          </button>
        </div>
      </section>
    </div>
  );
};

export default ChannelInfoModal;
