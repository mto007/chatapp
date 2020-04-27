import React, { useState } from "react";

export const ChatContext = React.createContext(null);

export const ChatContextProvider = (props) => {
  const setChatUser = (user) => {
    setState({
      ...state,
      chatUser: {
        user: user,
        isLoggedIn: true,
      },
    });
  };
  const initState = {
    chatUser: {
      user: "",
      isLoggedIn: false,
    },
    setChatUser: setChatUser,
  };
  const [state, setState] = useState(initState);

  return (
    <ChatContext.Provider value={state}>{props.children}</ChatContext.Provider>
  );
};
