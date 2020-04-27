import React from "react";
import { Container } from "react-bootstrap";
import ChatParent from "./components/ChatParent";
import SocketContext from "./components/SocketContext";
import { ChatContextProvider } from "./components/ChatContext";
import { v4 as uuidv4 } from "uuid";

const id = uuidv4();
const uri = encodeURI(`ws://localhost:63564/ws?u=${id}`);

function App() {
  return (
    <Container>
      <SocketContext.Provider value={new WebSocket(uri)}>
        <ChatContextProvider>
          <ChatParent />
        </ChatContextProvider>
      </SocketContext.Provider>
    </Container>
  );
}

export default App;
