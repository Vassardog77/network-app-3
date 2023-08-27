import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import { base_url } from "../../api";
import { deleteNotification } from '../../actions/notificationActions';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Select from 'react-native-dropdown-picker';

const socket = io.connect(base_url);
const current_user = JSON.parse(localStorage.getItem('user'));

function ChatVisuals({ route }) {
  // Use optional chaining to prevent undefined errors
  const url_room = route?.params?.url_room;
  const decodedUrlRoom = url_room ? decodeURIComponent(url_room) : null;

  const [Room, setRoom] = useState("");
  const [Roomlist, setRoomlist] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [newChat, setnewChat] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailOptions, setEmailOptions] = useState([]);

  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications);

  useEffect(() => {
    if (decodedUrlRoom) {
      joinRoom(decodedUrlRoom);
    }
  }, [decodedUrlRoom]);

  const joinRoom = (email_list) => {
    console.log(email_list);
    setShowChat(false);
    setSelectedEmails([]);
  
    setTimeout(() => {
      let emails = email_list.split(',').map(email => email.trim()).sort();
      let room = emails.includes(current_user.email) ? emails.join(', ') : [current_user.email, ...emails].sort().join(', ');
  
      setRoom(room);
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
  };

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
      const roomlist_array = response.data.map(roomObj => {
        let room = roomObj.room;
        let roomName = roomObj.room_name;
        let usernames = room.split(',').map(email => email.trim().split('@')[0]);
        let displayText = roomName ? roomName : usernames.join(', ');
        return {
          room: room,
          displayText: displayText
        };
      });
      setRoomlist(roomlist_array);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>Previous Chats:</Text>
        <FlatList 
          data={Roomlist}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => joinRoom(item.room)}>
              <Text>{item.displayText}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.room}
        />

        {!newChat ? (
          <Button title="Create New Chat?" onPress={() => setnewChat(true)} />
        ) : (
          <View>
            <Text>Select Users:</Text>
            <Select 
              items={emailOptions}
              multiple={true}
              defaultValue={selectedEmails}
              onChangeItem={item => setSelectedEmails(item)}
            />
            <Button title="Create Chat" onPress={() => joinRoom(selectedEmails.map(emailOption => emailOption.value).join(', '))} />
          </View>
        )}
      </View>

      {!showChat ? (
        <View style={{ flex: 2 }}>
          {newChat && <Button title="Create Chat" onPress={() => joinRoom(selectedEmails.map(emailOption => emailOption.value).join(', '))} />}
        </View>
      ) : (
        <Chat socket={socket} username={current_user.email} room={Room} />
      )}
    </View>
  );
}

export default ChatVisuals;
