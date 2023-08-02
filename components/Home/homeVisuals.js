import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent2 from './calendarComponent2';
import HomeFunctionality from './homeFunctionality'

function HomeVisuals(props) {
    const popupRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                var x = document.getElementById("popup");
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
    }, []);

    function display() {
        var x = document.getElementById("popup");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    }

    function navigateToCreatePost() {
        navigate('/create_post');
    }

    return (
        <div className='home'>
            <div className='home_post_buttons'>
                <button onClick={navigateToCreatePost}>+ Create Post</button>
                <button onClick={display}>+ Create Event</button>
                <div id='popup' ref={popupRef}><HomeFunctionality></HomeFunctionality></div>
            </div>
            <CalendarComponent2></CalendarComponent2>
        </div>
    );
}

export default HomeVisuals;
