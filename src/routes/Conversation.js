import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getChannelDetails, getMessage, sendMessage } from "../api";
import { ChannelInfoModal } from "../parts";
import { getCurrentUser, getUsers } from "../utils/Utils";

import "./Conversation.css";

const Conversation = ({ path, type }) => {
  const currentUser = getCurrentUser();

  const location = useLocation();
  const { state } = location;

  const sendMessageBody = useRef("");
  const bottomView = useRef(null);

  const [msgs, setMsgs] = useState([]);
  const [counter, setCounter] = useState(0);

  const [channelMembers, setChannelMembers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const POLLING_TIMEOUT_SECS = process.env.POLLING_TIMEOUT_SECS || 30;

  useEffect(() => {
    updateMessages();
    updateChannelInfo();
    console.log("conv ctr", counter);
    const timer = setTimeout(() => {
      setCounter(counter + 1);
      updateMessages();
    }, POLLING_TIMEOUT_SECS * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [counter]);

  const updateMessages = async () => {
    const msgsData = await getMessage({
      receiverId: state.id,
      currentUser,
      receiverClass: state.type,
    });
    setMsgs(msgsData);
  };

  const updateChannelInfo = async () => {
    const channelInfo = await getChannelDetails(state.id, currentUser.headers);
    const usersList = getUsers();
    const membersInfo = channelInfo.data.channel_members
      .map((member) => {
        const memberId = member.user_id.toString();
        return Object.keys(usersList)
          .filter((userId) => memberId === userId)
          .map((id) => {
            //console.log("zxc", usersList[id], usersList[id].uid);
            return { id: id, ...usersList[id] };
          });
      })
      .map((member) => member[0]);
    setChannelMembers(membersInfo);
  };
  const scrollToBottom = () => {
    bottomView.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);
  /*
  Render conversation
  */
  const renderMessage = (message, msgTime) => {
    return (
      <div className="message-container">
        <div className="message-header">
          <span className="message-sender">
            {currentUser.data.uid === message.sender.uid
              ? "Me "
              : `${message.sender.uid} `}
          </span>
          <span className="message-time">{msgTime}</span>
        </div>
        <div className="message-body">{message.body}</div>
      </div>
    );
  };

  const renderConversationDate = (date, message, msgTime) => {
    return (
      <>
        <div className="message-date" id={date}>
          {date}
        </div>
        <div className="message-divider"></div>
        {renderMessage(message, msgTime)}
      </>
    );
  };

  let prevDate = "";
  const renderConversation = msgs?.map((msg, index) => {
    const [date, currDate, msgTime] = msg.created_at.match(/^(.+)T(.+)\./);
    //if first msg
    if (!index) {
      prevDate = currDate;
      return renderConversationDate(currDate, msg, msgTime);
    }

    //if msg is not first for the date
    if (prevDate === currDate) {
      return renderMessage(msg, msgTime);
    }

    //if first msg for the date
    prevDate = currDate;
    return renderConversationDate(currDate, msg, msgTime);
  });

  const handleShowModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderChannelInfoButton = () => {
    if (state.type === "Channel") {
      return (
        <button
          className="channel-info-button fa-solid fa-circle-info"
          onClick={handleShowModal}
        ></button>
      );
    }
    return;
  };

  const handleSendMessage = async () => {
    sendMessage(
      state.id,
      state.type,
      sendMessageBody.current.value,
      currentUser.headers
    );
    sendMessageBody.current.value = "";
    const msgsData = await getMessage({
      receiverId: state.id,
      currentUser,
      receiverClass: state.type,
    });
    console.log("conv", msgsData);
    setMsgs(msgsData);
  };

  return (
    <section className="chat-box outlet">
      <ChannelInfoModal
        name={state.name}
        id={state.id}
        members={channelMembers}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <div className="receiver-info">
        <span className="receiver-uid">
          <span className="receiver-name">{state.name}</span>
          <span className="receiver-id">ID: {state.id}</span>
          {renderChannelInfoButton()}
        </span>
      </div>
      <div className="conversation-container">
        {renderConversation}
        <div ref={bottomView} />
      </div>
      <div className="chat-container">
        <textarea
          type="text"
          className="send-message-body"
          ref={sendMessageBody}
        />
        <button className="send-message" onClick={handleSendMessage}>
          SEND
        </button>
      </div>
    </section>
  );
};

export default Conversation;
