import React, { useState } from "react";

export const Themes = {
  blue: {
    buttoncolor: "blue",
    linecolor: "gray",
    boxshadow: "0 0 0 0.2rem lightblue",
  },
  purple: {
    buttoncolor: "purple",
    linecolor: "black",
    buttoncolorhover: "rgb(231, 46, 191)",
    boxshadow: "0 0 0 0.2rem grey",
  },
};

export const StyleContext = React.createContext(
  Themes.blue // default value
);

export const StyleContextProvider = (props) => {
  const setStyle = (style) => {
    setState({
      ...state,
      style: style,
    });
  };
  const initState = {
    style: Themes.blue,
    setStyle: setStyle,
  };
  const [state, setState] = useState(initState);

  return (
    <StyleContext.Provider value={state}>
      {props.children}
    </StyleContext.Provider>
  );
};
