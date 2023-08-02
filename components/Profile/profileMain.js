import React, { useState } from 'react';
import ProfileEdit from './profileEdit';
import ProfileView from './profileView';

function ProfileMain(props) {

    const [View_mode, setView_mode] = useState(true)
    const [Content, setContent] = useState(<ProfileView></ProfileView>) 
    const [Button, setButton] = useState("Edit Profile")
    

    let change_view = () => {
        if (View_mode === true) {
            setContent(<ProfileEdit></ProfileEdit>)
            setButton("View Profile")
            console.log(View_mode)
            setView_mode(false)
        } else {
            setContent(<ProfileView></ProfileView>)
            setButton("Edit Profile")
            console.log(View_mode)
            setView_mode(true)
        }}
    

    return (
        <div>
            <button onClick={change_view}>{Button}</button>
            {Content}
        </div>
    );
}

export default ProfileMain;