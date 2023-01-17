const getCurrentUser = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser;
};

const getLocalUserData = (currentUserId) => {
  return JSON.parse(localStorage.getItem(currentUserId));
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem("users"));
};

const getLocalUsers = () => {
  return JSON.parse(localStorage.getItem("newUsers"));
};

export { getCurrentUser, getLocalUserData, getUsers, getLocalUsers };
