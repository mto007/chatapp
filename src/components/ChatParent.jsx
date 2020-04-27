import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import "./ChatParent.scss";
import Participants from "./Participants";
import Messages from "./Messages";
import SocketContext from "./SocketContext";
import { ChatContext } from "./ChatContext";

export default function ChatParent() {
  const currentChatContext = React.useContext(ChatContext);
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [key, setKey] = useState(1);
  const [show, setShow] = useState(true);

  const websocket = useContext(SocketContext);

  useEffect(() => {
    if (websocket !== undefined && websocket !== null) {
      websocket.onmessage = (msg) => {
        const incomingMessage = `Message from WebSocket: ${msg.data}`;
        console.log(incomingMessage);
        const dataObj = JSON.parse(msg.data);

        setParticipants(dataObj.UserNames);
        setMessages(dataObj.Messages);
      };
    }
  });

  const addMessage = (message) => {
    console.log("send message");
    try {
      websocket.send(JSON.stringify(message));
    } catch (error) {
      console.log(error); // catch error
    }
  };

  const joinChat = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const headMessage = {
      Type: "U",
      UserName: user,
      WSType: 0,
    };
    addMessage(headMessage);
    currentChatContext && currentChatContext.setChatUser(user);

    setShow(false);
  };

  return (
    <div>
      <Form
        onSubmit={joinChat}
        style={{ display: show === true ? "" : "none" }}
      >
        <Form.Row>
          <Form.Group>
            <Form.Control
              onChange={(e) => setUser(e.target.value)}
              type="text"
              required
              maxLength={20}
              placeholder="enter your name"
            />
          </Form.Group>

          <Form.Group style={{ paddingLeft: "15px" }}>
            <Button type="submit">Join chat</Button>
          </Form.Group>
        </Form.Row>
      </Form>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="chatTabs">
        <Tab eventKey={1} title="Chat">
          <Messages messageList={messages} />
        </Tab>
        <Tab eventKey={2} title={"Participants (" + participants.length + " )"}>
          <Participants participantList={participants} />
        </Tab>
      </Tabs>
    </div>
  );
}
