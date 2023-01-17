import axios from "axios";

const URL = process.env.REACT_APP_MSG_URL;

const createUser = async ({ email, password, passwordConfirmation }) => {
  return await axios
    .post(`${URL}/auth/`, {
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    .then((response) => response)
    .catch((error) => error);
};

const login = async ({ email, password }) => {
  return await axios
    .post(`${URL}/auth/sign_in`, {
      email,
      password,
    })
    .then((response) => {
      console.log("Logged in...", response);
      return response;
    });
};

const sendMessage = async (receiver_id, receiver_class, body, sender) => {
  const accessToken = sender["access-token"];
  const client = sender.client;
  const expiry = sender.expiry;
  const uid = sender.uid;
  return await axios
    .post(`${URL}/messages`, {
      receiver_id,
      receiver_class,
      body,
      "access-token": accessToken,
      client,
      expiry,
      uid,
      //headers,
    })
    .then((response) => {
      //headers = response.headers;
      console.log("Sending message...", response);
    })
    .catch((error) => {
      console.log("Failed to send message", error);
    });
};

const createChannel = async (name, user_ids, currentUser) => {
  const accessToken = currentUser["access-token"];
  const client = currentUser.client;
  const expiry = currentUser.expiry;
  const uid = currentUser.uid;

  return await axios
    .post(`${URL}/channels`, {
      name,
      user_ids,
      "access-token": accessToken,
      client,
      expiry,
      uid,
    })
    .then((response) => {
      console.log("Created channel: ", name);
      console.log("Members: ", user_ids);
      return response;
    })
    .catch((error) => {
      console.log("error:", error);
      return error;
    });
};

const getMessages = async ({ user, type, usersList }) => {
  const headers = {
    "access-token": user.headers["access-token"],
    client: user.headers.client,
    expiry: user.headers.expiry,
    uid: user.headers.uid,
  };

  console.log(`Retrieving direct messages of ${headers.uid}`);
  console.log(`Number of users: ${usersList.data.length}`);

  return usersList.data.map(async (user) => {
    const userId = user.id;
    if (userId > 3095) {
      return await axios
        .get(`${URL}/messages?receiver_id=${userId}&receiver_class=${type}`, {
          receiver_id: userId,
          receiver_class: type,
          headers,
        })
        .then((response) => {
          if (response.data.data.length) {
            return response.data;
          }
        });
    } else {
      return 3;
    }
  });
};

const getMessage = async ({ currentUser, receiverId, receiverClass }) => {
  //console.log("api", receiverId);
  const headers = {
    "access-token": currentUser.headers["access-token"],
    client: currentUser.headers.client,
    expiry: currentUser.headers.expiry,
    uid: currentUser.headers.uid,
  };

  return await axios
    .get(
      `${URL}/messages?receiver_id=${receiverId}&receiver_class=${receiverClass}`,
      {
        receiver_id: receiverId,
        receiver_class: receiverClass,
        headers,
      }
    )
    .then((response) => {
      return response.data.data;
    });
};

const getAllUsers = async (headers) => {
  return await axios.get(`${URL}/users`, { headers }).then((response) => {
    return response.data;
  });
};

const getAllChannels = async (headers) => {
  return await axios.get(`${URL}/channels`, { headers }).then((response) => {
    //console.log("my channels:", response.data);
    return response.data;
  });
};

const getChannelDetails = async (channelId, headers) => {
  return await axios
    .get(`${URL}/channels/${channelId}`, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

const addUser = async ({ channelId, memberId, currentUser }) => {
  console.log(currentUser);
  const accessToken = currentUser["access-token"];
  const client = currentUser.client;
  const expiry = currentUser.expiry;
  const uid = currentUser.uid;

  return await axios
    .post(`${URL}/channel/add_member`, {
      "access-token": accessToken,
      client,
      expiry,
      uid,
      id: channelId,
      member_id: memberId,
    })
    .then((response) => {
      console.log(
        `[SUCCESS] user ${memberId} added to channel ${channelId}.`,
        response.data
      );
      return response.data;
    })
    .catch((error) => {
      console.log(`[ERROR] user ${memberId} not added.`, error);
      return error;
    });
};

export {
  createUser,
  login,
  getAllUsers,
  getAllChannels,
  sendMessage,
  getMessages,
  getMessage,
  createChannel,
  getChannelDetails,
  addUser,
};
