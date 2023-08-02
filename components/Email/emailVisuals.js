import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInbox,faEnvelope } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { base_url } from '../../api';
import EmailFunctionality from './emailFunctionality';
import GoogleLogin from '../MediaLogin/GoogleLogin';
const current_user = JSON.parse(localStorage.getItem('user'))

function Emailvisuals(props) {//email visuals
    const popupRef = useRef();
    const [Emails, setEmails] = useState([
        { name: '', date: '', subject: '', message: ''},
        { name: '', date: '', subject: '', message: ''},
        { name: '', date: '', subject: '', message: ''},
        { name: '', date: '', subject: '', message: ''},
        { name: '', date: '', subject: '', message: ''},
    ])
    const [error, setError] = useState(false);

    useEffect(() => { 
        axios.post(base_url+'/email/list', {
            user: current_user.email
        })
        .then(response => {
            console.log(response.data)
            setEmails([
                { name: response.data[0].payload.headers.find(header => header.name === 'From').value, date: response.data[0].payload.headers.find(header => header.name === 'Date').value, subject: response.data[0].payload.headers.find(header => header.name === 'Subject').value, message:response.data[0].snippet},
                { name: response.data[1].payload.headers.find(header => header.name === 'From').value, date: response.data[1].payload.headers.find(header => header.name === 'Date').value, subject: response.data[1].payload.headers.find(header => header.name === 'Subject').value, message:response.data[1].snippet},
                { name: response.data[2].payload.headers.find(header => header.name === 'From').value, date: response.data[2].payload.headers.find(header => header.name === 'Date').value, subject: response.data[2].payload.headers.find(header => header.name === 'Subject').value, message:response.data[2].snippet},
                { name: response.data[3].payload.headers.find(header => header.name === 'From').value, date: response.data[3].payload.headers.find(header => header.name === 'Date').value, subject: response.data[3].payload.headers.find(header => header.name === 'Subject').value, message:response.data[3].snippet},
                { name: response.data[4].payload.headers.find(header => header.name === 'From').value, date: response.data[4].payload.headers.find(header => header.name === 'Date').value, subject: response.data[4].payload.headers.find(header => header.name === 'Subject').value, message:response.data[4].snippet},
            ])
        })
        .catch(error => {
            console.log(error);
            setError(true);
        });
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                var x = document.getElementById("popup3");
                if (x.style.display === "block") {
                    setTimeout(function(){
                        x.style.display = "none";
                    }, 1);
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function display2() {
        var x = document.getElementById("popup3");
        if (x.style.display === "block") {
          x.style.display = "none";
        } else {
          x.style.display = "block";
        }
    }

// Email Front End  
    return (
        <div>
            <div className = 'component_parent'>
                <div className = 'component_header'>Email <FontAwesomeIcon icon={faEnvelope}/></div>
                <div className='create_buttons'><button onClick={display2}>+ Send Email</button></div>
                {error ? 
                (<div className='login_message'>
                    <div>Please log in with google to continue</div>
                    <div className='Loginbar'><GoogleLogin /></div>
                </div>) 
                :
                (<div className = 'email_box'>
                    <div className = 'email_box_top'>
                        <div className = 'email_box_top_text'>All</div>
                    </div>
                    <textarea className = 'email_searchBar' placeholder=''></textarea>
                    <div className = 'email_info_header'>
                             <FontAwesomeIcon className = 'inbox_icon' icon={faInbox}/>
                            <div className = 'email_info_header_text'>
                                   <div className = "email_box_parent-item Email-grid-item-1">Name</div>  
                                   <div className = "email_box_parent-item Email-grid-item-2">Subject</div>  
                                   <div className = "email_box_parent-item Email-grid-item-3">Message</div>  
                                   <div className = "email_box_parent-item Email-grid-item-4">Date</div>  
                            </div> 
                    </div>
                    <div className = 'email_receive_box'>
                        <div className = "email_receive_parent">  
                                   <div className = "email_receive_parent-item Receive-grid-item-1">{Emails[0].name}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-2">{Emails[0].subject}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-3">{Emails[0].message}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-4">{Emails[0].date}</div> 
                        </div>
                        <div className = "email_receive_parent">
                                   <div className = "email_receive_parent-item Receive-grid-item-1">{Emails[1].name}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-2">{Emails[1].subject}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-3">{Emails[1].message}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-4">{Emails[1].date}</div> 
                        </div>
                        <div className = "email_receive_parent">
                                   <div className = "email_receive_parent-item Receive-grid-item-1">{Emails[2].name}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-2">{Emails[2].subject}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-3">{Emails[2].message}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-4">{Emails[2].date}</div> 
                        </div>
                        <div className = "email_receive_parent">
                                   <div className = "email_receive_parent-item Receive-grid-item-1">{Emails[3].name}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-2">{Emails[3].subject}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-3">{Emails[3].message}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-4">{Emails[3].date}</div> 
                        </div>
                        <div className = "email_receive_parent">
                                   <div className = "email_receive_parent-item Receive-grid-item-1">{Emails[4].name}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-2">{Emails[4].subject}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-3">{Emails[4].message}</div>  
                                   <div className = "email_receive_parent-item Receive-grid-item-4">{Emails[4].date}</div> 
                        </div>
                    </div>
                </div>)}
            </div>
            <div id='popup3' ref={popupRef}><EmailFunctionality></EmailFunctionality></div>            
        </div>
    );
}

export default Emailvisuals; 
