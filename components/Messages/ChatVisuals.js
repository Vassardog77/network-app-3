import io from "socket.io-client";
import { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./Chat";
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";
import { base_url } from "../../api";
import { deleteNotification } from '../../actions/notificationActions' 
import { useParams, useLocation } from 'react-router-dom';
const socket = io.connect(base_url);
const current_user = JSON.parse(localStorage.getItem('user'))

function ChatVisuals() {
  const location = useLocation();
  let { url_room } = useParams();
  url_room = decodeURIComponent(url_room);

  const [Room, setRoom] = useState("");
  const [Roomlist, setRoomlist] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [newChat, setnewChat] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailOptions, setEmailOptions] = useState([]);

  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications);

  useEffect(() => {
    if (url_room) {
      joinRoom(url_room);
    }
  }, [location]);

  const joinRoom = (email_list) => {
    console.log(email_list)
    setShowChat(false)
    setSelectedEmails([]);
  
    setTimeout(() => {
        // Split the emails, sort them and join them back into a string
        let emails = email_list.split(',').map(email => email.trim()).sort();
        let room = emails.includes(current_user.email) ? emails.join(', ') : [current_user.email, ...emails].sort().join(', ');
  
        setRoom(room)
        socket.emit("join_room", room);
  
        let newNotifications = Array.isArray(notifications) ? notifications.filter((notification) => {
          if (notification.type === 'message' && notification.content.room === room) {
              dispatch(deleteNotification({user: current_user.email, unreads: notification})); 
              return false; 
          }
          return true;
        }) : [];
  
        setShowChat(true);
    }, 1);
  }

  useEffect(() => {           
    axios.get(base_url+'/api/user/get') 
    .then(response => {
      const options = response.data.map(user => ({
        value: user.email,
        label: user.email.split('@')[0]
      }));

      setEmailOptions(options);
    });

    axios.post(base_url+'/chats', {
      "user": current_user.email
    })
    .then(response => {
      let roomlist_array = []
      response.data.forEach(roomObj => {
        let room = roomObj.room;
        let roomName = roomObj.room_name;
        let usernames = room.split(',').map(email => email.trim().split('@')[0]);
        let displayText = roomName ? roomName : usernames.join(', ');
        roomlist_array.push(<div key={room}><button onClick={() => joinRoom(room)}>{displayText}</button></div>)
      })
      setRoomlist(<div>{roomlist_array}</div>)
    })
}, [])



  return (
    <div className="chat_window_parent">
      <div className="join_chat_container">
          <div className="previous_chat_parent">
            <div>Previous Chats:</div>
            {Roomlist}
          </div>
          {!newChat ? 
          (<div className="new_chat_creator"><button onClick={() => setnewChat(true)}>Create New Chat?</button></div>) : 
          (<div className="new_chat_creator">
            Select Users:
            <Select
              isMulti
              options={emailOptions}
              value={selectedEmails}
              onChange={(values) => setSelectedEmails(values)}
            />
            <button onClick={() => joinRoom(selectedEmails.map(emailOption => emailOption.value).join(', '))}>
              Create Chat
            </button>
          </div>)}
      </div>
      {!showChat ? (
        <div className="chat_window">
          {newChat && <div>
            <button onClick={() => joinRoom(selectedEmails.map(emailOption => emailOption.value).join(', '))}>Create Chat</button>
          </div>}
        </div>
      ) : (
        <Chat socket={socket} username={current_user.email} room={Room} />
      )}
    </div>
  );
}

export default ChatVisuals;
