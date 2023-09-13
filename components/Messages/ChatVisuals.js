import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import { base_url } from "../../api";
import { deleteNotification } from '../../actions/notificationActions';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Select from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io.connect(base_url);

function ChatVisuals({ room, navigation }) {
  const decodedRoom = room ? decodeURIComponent(room) : null;

  const [currentUser, setCurrentUser] = useState(null);
  const [Room, setRoom] = useState("");
  const [Roomlist, setRoomlist] = useState([]);
  const [newChat, setnewChat] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailOptions, setEmailOptions] = useState([]);

  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications);

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await AsyncStorage.getItem('user');
      setCurrentUser(JSON.parse(user));
    }

    fetchCurrentUser();

    if (decodedRoom) {
      joinRoom(decodedRoom);
    }
  }, [decodedRoom]);

  const joinRoom = (email_list) => {
    console.log(email_list);
    setSelectedEmails([]);

    setTimeout(() => {
      let emails = email_list.split(',').map(email => email.trim()).sort();
      let room = emails.includes(currentUser.email) ? emails.join(', ') : [currentUser.email, ...emails].sort().join(', ');

      setRoom(room);
      socket.emit("join_room", room);

      let newNotifications = Array.isArray(notifications) ? notifications.filter((notification) => {
        if (notification.type === 'message' && notification.content.room === room) {
          dispatch(deleteNotification({user: currentUser.email, unreads: notification}));
          return false;
        }
        return true;
      }) : [];

      // Navigate to the ChatScreen and pass necessary data as props
      navigation.navigate('ChatScreen', {
        socket: socket,
        username: currentUser.email,
        room: room  // Using the local room variable directly
      });

    }, 1);
  };

  useEffect(() => {
    axios.get(base_url + '/api/user/get')
      .then(response => {
        const options = response.data.map(user => ({
          value: user.email,
          label: user.email.split('@')[0]
        }));
        setEmailOptions(options);
      });

    if (currentUser) {
      axios.post(base_url + '/chats', {
        "user": currentUser.email
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
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
        <View style={styles.chatList}>
            <Text style={styles.header}>Previous Chats:</Text>
            <FlatList
                data={Roomlist}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatItem} onPress={() => joinRoom(item.room)}>
                        <Text style={styles.chatText}>{item.displayText}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.room}
            />

            {!newChat ? (
                <Button title="Create New Chat?" onPress={() => setnewChat(true)} />
            ) : null}
        </View>

        {newChat && (
            <View style={styles.newChatContainer}>
                <View style={styles.newChat}>
                    <Text style={styles.header}>Select Users:</Text>
                    <Select
                        items={emailOptions}
                        multiple={true}
                        defaultValue={selectedEmails}
                        onChangeItem={item => setSelectedEmails(item)}
                    />
                </View>
                <Button title="Create Chat" onPress={() => joinRoom(selectedEmails.map(emailOption => emailOption.value).join(', '))} />
            </View>
        )}
    </View>
);
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f8f8f8'
  },
  chatList: {
      flex: 4, // Adjusted this
      padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  chatText: {
    fontSize: 16,
  },
  newChat: {
    marginTop: 20,
    padding: 10,
  },
  flex2: {
    flex: 2,
  },
  newChatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}
});

export default ChatVisuals;