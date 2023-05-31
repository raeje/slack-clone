import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ componentId, directMessages, setDirectMessages }) => {
  const [userIdOptions, setUserIdOptions] = useState([]);
  //const [user, setUser] = useState("");
  const user = useRef("");
  const [enableAdd, setEnableAdd] = useState(true);

  const handleIdChange = (e) => {
    const value = e.target.value;
    //setUser(value);
    setEnableAdd(value.length ? false : true);
  };

  const setOptions = (filteredList) => {
    setUserIdOptions(
      filteredList.map((item, index) => (
        <option key={(item, index)} value={item.uid}>
          id: {item.id}
        </option>
      ))
    );
  };

  const getUsers = () => {
    let users = localStorage.getItem("users");
    users = users ? JSON.parse(localStorage.users) : [];
    return users;
  };

  useEffect(() => {
    const getFilteredUsersList = (key, value) => {
      const users = getUsers();
      //let filteredList = [];
      //Object.keys(users).forEach((id) => console.log(id, users[id]["uid"]));
      //filteredList = Object.keys(users).filter((id) =>
      //  users[id][key].includes(value)
      //);
      const filteredList = [];
      Object.keys(users).forEach((id) => {
        if (users[id][key].includes(value)) {
          filteredList.push(users[id]);
        }
      });
      console.log("sb filteredList", filteredList);

      return filteredList;
    };

    let filtered = [];
    if (user.current.value) {
      filtered = getFilteredUsersList("uid", user.current.value);
      setOptions(filtered);
    }
  }, [user.current.value]);

  const handleAddDirectMessage = () => {
    const userData = (() => {
      /*
      const localUsers = getUsers();
      const localUser = Object.keys(localUsers)
        .filter((id) => localUsers[id]["uid"] === user.current.value)
        .map((id) => localUsers[id]);
      console.log("localUser", localUser);
      return localUser;
      */
      const localUsers = getUsers();
      return Object.keys(localUsers)
        .filter((id) => localUsers[id]["uid"] === user.current.value)
        .map((id) => {
          return { id: id, ...localUsers[id] };
        });
    })();

    const userAlreadyListed = directMessages
      .map((item) => item.uid)
      .includes(user.current.value);

    // if userId is not found/does not exist
    console.log(userData);
    if (!userData.length) {
      console.log(`[ERROR]: user '${user.current.value}' not found.`);
      return;
    }

    //if userId is already included in directMessages list
    if (userAlreadyListed) {
      console.log(`[ERROR]: user '${user.current.value}' already listed`);
      return;
    }

    //add user to  directMessages list
    console.log(`[SUCCESS]: added user '${user.current.value} to list.`);
    console.log(userData[0]);
    setDirectMessages((prev) => [...prev, userData[0]]);
    user.current.value = "";
  };

  return (
    <div className={`search-bar ${componentId} w-full`}>
      <input
        id={componentId}
        type="text"
        ref={user}
        className="search-bar-input w-full"
        list={componentId}
        placeholder="Search user by email"
        autoComplete="off"
        onChange={(e) => handleIdChange(e)}
      />
      <datalist id={componentId}>{userIdOptions}</datalist>
      <button
        className="add-direct-message fa-solid fa-plus search-bar-button"
        onClick={handleAddDirectMessage}
        disabled={enableAdd}
      ></button>
    </div>
  );
};

export default SearchBar;
