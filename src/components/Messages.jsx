import React, { useContext, useState } from "react";
import "./Messages.scss";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { emojify } from "react-emojione";
import Linkify from "react-linkify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ChatContext } from "./ChatContext";
import SocketContext from "./SocketContext";

export default function Messages({ messageList }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);
  const [text, setText] = useState("");
  const currentChatContext = React.useContext(ChatContext);
  const currentUserId = currentChatContext && currentChatContext.chatUser.user;
  const currentIsLoggedIn =
    currentChatContext && currentChatContext.chatUser.isLoggedIn;
  const websocket = useContext(SocketContext);

  const messages =
    messageList !== undefined
      ? messageList.map((message, index) => (
          <tbody>
            <tr key={message.Id}>
              <td>
                <b>{message.Username}</b> {message.MessagDateTime.slice(11, 16)}
              </td>
            </tr>
            <tr key={index}>
              <td>
                <Linkify
                  properties={{
                    target: "_blank",
                    style: { color: "blue" },
                  }}
                >
                  {emojify(message.Text, { output: "unicode" })}
                </Linkify>
              </td>
              <td>
                <Button
                  size="sm"
                  style={{
                    display:
                      message.Username === currentUserId &&
                      message.Status !== 2 &&
                      message.IsInitialMessage === false
                        ? ""
                        : "none",
                  }}
                  onClick={() => handleEditMessage(message)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </td>
              <td>
                <Button
                  size="sm"
                  style={{
                    display:
                      message.Username === currentUserId &&
                      message.Status !== 2 &&
                      message.IsInitialMessage === false
                        ? ""
                        : "none",
                  }}
                  onClick={() => handleDeleteMessage(message)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          </tbody>
        ))
      : null;

  const handleEditMessage = (message) => {
    setText(message.Text);
    setMessage(message);
    setShow(true);
  };

  const handleDeleteMessage = (message) => {
    const headMessage = {
      Type: "M",
      WSType: 0,
      Message: {
        Text: message.Text,
        Id: message.Id,
        MessagDateTime: message.MessagDateTime,
        Username: message.Username,
        Status: 2,
      },
    };
    try {
      websocket.send(JSON.stringify(headMessage));
    } catch (error) {
      console.log(error);
    }
  };

  const sendEdit = () => {
    const headMessage = {
      Type: "M",
      WSType: 0,
      Message: {
        Text: text,
        Username: currentUserId,
        Id: message.Id,
        MessagDateTime: message.MessagDateTime,
        Status: 1,
      },
    };
    try {
      websocket.send(JSON.stringify(headMessage));
    } catch (error) {
      console.log(error);
    }
    setShow(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const headMessage = {
        Type: "M",
        WSType: 0,
        Message: {
          Text: e.target.value,
          Username: currentUserId,
          Status: 0,
        },
      };
      try {
        websocket.send(JSON.stringify(headMessage));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Table className="table">{messages}</Table>
      <div className="divider" />
      <Form style={{ display: currentIsLoggedIn === true ? "" : "none" }}>
        <Form.Group controlId="newMessage">
          <Form.Control
            type="text"
            placeholder="Enter new message"
            maxLength={500}
            onKeyPress={handleKeyPress}
          />
        </Form.Group>
      </Form>
      <Modal show={show} onHide={sendEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="editTextArea">
            <Form.Control
              as="textarea"
              rows="3"
              maxLength={500}
              value={text}
              onChange={(ev) => setText(ev.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={sendEdit}>
            Edit message
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
