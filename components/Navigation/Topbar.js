import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import CustomLink from "../../customComponents/CustomLink";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useLogout } from "../../hooks/useLogout";
import { base_url } from "../../api";
import Notifications from './Notifications';

export default function NavBar() {
    const { logout } = useLogout();
    const current_user = JSON.parse(localStorage.getItem('user'))
    const notificationRef = useRef();

    // use redux state instead of local state
    const notifications = useSelector(state => state.notifications);
    const validNotifications = Array.isArray(notifications)
    ? notifications.filter(notification => ['message', 'comment', 'reply'].includes(notification.type))
    : [];
    const dispatch = useDispatch();

    useEffect(() => {
        axios.post(base_url+'/notification/get',
        {user: current_user.email})
            .then(response => {
                console.log(response.data)
                // update the redux state instead of local state
                dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
                localStorage.setItem('notifications', JSON.stringify(response.data));
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });

        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                var x = document.getElementById("notificationPopup");
                if (x.style.display === "block") {
                    setTimeout(function(){
                        x.style.display = "none";
                    }, 100);
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch]);

    function displayNotification() {
        var x = document.getElementById("notificationPopup");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    }

    // use the length of the valid notifications array for the notificationCount
    let notificationCount = validNotifications ? validNotifications.length : 0;

    return (
        <div className="Topbar">
            <span/>
            <div>
                <div className="notification-icon" onClick={displayNotification}>
                    <FontAwesomeIcon icon={faBell} style={{ fontSize: '1.5vw'}}/>
                    {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
                    <div id='notificationPopup' ref={notificationRef}>
                        <Notifications />
                    </div>
                </div>
                <img src={current_user.profile_pic} alt=""></img>
                <button onClick={logout}>Log Out</button>
            </div>
        </div>
    )
}
