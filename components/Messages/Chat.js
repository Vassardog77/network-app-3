import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { base_url } from "../../api";
import { useDispatch } from 'react-redux'
import { sendNotification } from '../../actions/notificationActions' 
import Addpeople from "./Addpeople";
import RenameChat from "./RenameChat";
const current_user = JSON.parse(localStorage.getItem('user'))


function Chat({ socket, username, room }) {
  const dispatch = useDispatch();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  let message_blocker = false //setting message blocker to stop duplicate messages (glitch)
  const chatWindowRef = useRef(null);

  // convert the room string to an array and trim the whitespace
  let roomEmails = room.split(",").map(email => email.trim());

  // filter out the current user's email
  let recipient = roomEmails.filter(email => email !== current_user.email);


  const sendMessage = async () => {
    let timeoutId
    timeoutId = setTimeout(() => { //making the window scroll down to bottom (using setTimeout so that it happens after message is sent)
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }, 100);
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      //adding notification information
      //console.log("sending message")
      dispatch(sendNotification({
        type : "message",
        room: room,
        recipient : recipient,
        sender : current_user.email,
        content : messageData
      }))
    }
  };

  useEffect(() => { //getting message history
    axios.post(base_url+'/chats', {
      "room": room
    })
        .then(response => {
            //console.log(response.data)
            if (response.data){
              setMessageHistory(response.data)
            } else {
              return
            }
          })
    let timeoutId
    timeoutId = setTimeout(() => {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }, 100);

  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => { //recieving messages (message blocker made to stop duplicate message glitch);
      if (message_blocker === false) {
        setMessageList((list) => [...list, data]);
        let timeoutId
          timeoutId = setTimeout(() => {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }, 100);
        //message_blocker = true //uncomment this line to enable blocking of every other message
      } else {
        message_blocker = false
      }
    });
  }, [socket]);

  return (
    !room || room === "undefined" ? <div /> :
    <>
      <div className="addpeople_button">
        <Addpeople room={room} />
        <RenameChat room={room} />
      </div>
      <div className="chat_window" ref={chatWindowRef}>
        <div className="chat_body">
          <div className="message_container">
            {messageHistory.map((messageContent) => {
              return (
                <>
                  <div className={username === messageContent.author ? "message_you" : "message_other"}>
                    <div>
                      <div>
                        <p>{messageContent.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="message_author">{messageContent.author.split('@')[0]}</div>
                </>
              );
            })}
            {messageList.map((messageContent) => {
              return (
                <>
                  <div className={username === messageContent.author ? "message_you" : "message_other"}>
                    <div>
                      <div>
                        <p>{messageContent.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="message_author">{messageContent.author.split('@')[0]}</div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div className="chat_footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </>
  );
  
}

export default Chat;
