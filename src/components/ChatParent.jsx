import React, { useState, useEffect, useContext } from "react";
import {
  Tabs,
  Tab,
  Form,
  Button,
  ButtonGroup,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Participants from "./Participants";
import Messages from "./Messages";
import SocketContext from "./SocketContext";
import { ChatContext } from "./ChatContext";
import { StyleContext, Themes } from "./StyleContext";

export default function ChatParent() {
  const currentChatContext = React.useContext(ChatContext);
  const currentStyleContext = React.useContext(StyleContext);
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [key, setKey] = useState(1);
  const [show, setShow] = useState(true);
  const currentButtonColor =
    currentStyleContext && currentStyleContext.style.buttoncolor;
  const buttonStyle = {
    backgroundColor: currentButtonColor,
  };
  const currentLineColor =
    currentStyleContext && currentStyleContext.style.linecolor;
  const lineStyle = {
    borderColor: currentLineColor,
  };

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

  const handleStyleChange = (ev) => {
    const theme =
      ev.target.innerText === "Blue theme" ? Themes.blue : Themes.purple;
    currentStyleContext && currentStyleContext.setStyle(theme);
  };

  return (
    <div>
      <Row>
        <Col>
          <Form
            onSubmit={joinChat}
            style={{ display: show === true ? "" : "none" }}
          >
            <Form.Row>
              <Form.Group>
                <Form.Control
                  onChange={(e) => setUser(e.target.value)}
                  type="text"
                  style={lineStyle}
                  required
                  maxLength={20}
                  className="custom-p"
                  placeholder="enter your name"
                />
              </Form.Group>
              <Form.Group style={{ paddingLeft: "15px" }}>
                <Button style={buttonStyle} type="submit">
                  Join chat
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
          <Tabs
            className="custom-p"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            id="chatTabs"
          >
            <Tab className="custom-p" eventKey={1} title="Chat">
              <Messages messageList={messages} />
            </Tab>
            <Tab
              className="custom-p"
              eventKey={2}
              title={"Participants (" + participants.length + " )"}
            >
              <Participants participantList={participants} />
            </Tab>
          </Tabs>
        </Col>
        <Col xs lg="2">
          <div style={{ paddingBottom: "15px" }}>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                size="sm"
                id="dropdown-basic-button"
                className="btn-secondary"
                style={buttonStyle}
                onSelect={handleStyleChange}
              >
                <span>
                  <FontAwesomeIcon icon={faCog} />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item value="blue" onClick={handleStyleChange}>
                  Blue theme
                </Dropdown.Item>
                <Dropdown.Item value="purple" onClick={handleStyleChange}>
                  Purple theme
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </div>
  );
}
