import React, { useState, useEffect, useRef } from 'react';
import { renameChat } from '../../actions/chatActions';
import { useDispatch } from 'react-redux'

function RenameChat({ room }) {
  const dispatch = useDispatch();
  const [newChatName, setNewChatName] = useState(''); // New state variable for the text area value
  const [showTextArea, setShowTextArea] = useState(false); // New state variable to handle the visibility of the text area
  const renameRef = useRef(); // Reference to the parent element

  useEffect(() => {
    // Define the click handler
    const handleClickOutside = event => {
      if (renameRef.current && !renameRef.current.contains(event.target)) {
        setShowTextArea(false);
      }
    }

    // Attach the handler when the component is mounted
    document.addEventListener('mousedown', handleClickOutside);

    // Return a cleanup function to be run when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount

  let handleButtonClick = () => {
    if (showTextArea) {
      // The textarea is currently visible, so handle the renaming
      if (room && room !== "undefined") { // Checking if room is not undefined or "undefined"
        if (newChatName.trim() !== "") { // Checking if the text area is not empty
          console.log("dispatching")
          dispatch(renameChat({
            room: room,
            newChatName: newChatName
          }));
        } else {
          //alert("Chat name cannot be blank!");
        }
      } else {
        //alert("Room is undefined!");
      }
      // Reset the chat name and hide the text area
      setNewChatName('');
      setShowTextArea(false);
    } else {
      // The textarea is currently hidden, so show it
      setShowTextArea(true);
    }
  }

  return (
    <span className='rename' ref={renameRef}>
      {showTextArea && (
        <textarea 
          placeholder='Add new name...'
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
        />
      )}
      <button onClick={handleButtonClick}>{showTextArea ? 'Submit' : 'Rename Chat'}</button>
    </span>
  );
}

export default RenameChat;
