import React, { useEffect, useState, useRef } from 'react';
import { addPeople } from '../../actions/chatActions';
import axios from "axios";
import { base_url } from "../../api";
import { useDispatch } from 'react-redux'
import Select from 'react-select';

function Addpeople({ room }) {
    const [users, setUsers] = useState([]); // to store the users
    const [selectedUsers, setSelectedUsers] = useState([]); // to store selected users
    const [addingPeople, setAddingPeople] = useState(false); // to track whether we're adding people

    // Create a ref that we will attach to the span element
    const wrapperRef = useRef(null);

    // Function to handle outside click
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setAddingPeople(false);
        }
    };

    // Add the outside click listener when the component mounts and remove it when it unmounts
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {           
        axios.get(base_url+'/api/user/get') //getting all users to display 
        .then(response => {
          setUsers(response.data.map(user => ({ value: user.email, label: user.email })));
        })
    }, [])

    const dispatch = useDispatch();

    let add_people = () => {
        // Check if room is undefined or "undefined", or if no users are selected
        if (!room || room === "undefined" || selectedUsers.length === 0) {
            console.log("Room is undefined or no users selected. Can't submit.")
            return;
        }
        console.log("dispatching")
        dispatch(addPeople({
            room,
            selectedUsers: selectedUsers.map(user => user.value)
        }))
        setAddingPeople(false); // Reset state after adding people
        setSelectedUsers([]); // Clear selection after adding people
    }

    const handleSelectChange = (selectedOption) => {
        setSelectedUsers(selectedOption);
    }

    const handleClickAdd = () => {
        setAddingPeople(true); // Begin adding people
    }

    // Add the ref to the span
    return (
        <span ref={wrapperRef}>
            {addingPeople ? 
                <>
                    <Select
                        isMulti
                        value={selectedUsers}
                        onChange={handleSelectChange}
                        options={users}
                    />
                    <button onClick={add_people}>Submit</button>
                </> 
                :
                <button onClick={handleClickAdd}>+ Add People</button>
            }
        </span>
    );
}

export default Addpeople;
