import React, { useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { postEmail } from '../../actions/emailActions'
import axios from 'axios';
import { Buffer } from 'buffer'
import { base_url } from '../../api';
import GoogleLogin from '../MediaLogin/GoogleLogin';
const current_user = JSON.parse(localStorage.getItem('user'))


function EmailFunctionality(props) {

    let [Content, setContent] = useState()
    let google_login = localStorage.getItem('google_login')

    const dispatch = useDispatch()      //establishing dispatch function (necessary for some reason)

    let sendEmail = async (e) => {       //sending email to the server (function comming from actions folder)
        e.preventDefault()
        let data = Buffer.from(
            'Subject: '+e.target[1].value+'\n'+   //setting subject
            'To: '+e.target[0].value+'\n\n'+     //setting recipient
            e.target[2].value                   //setting body text
            ).toString('base64')
        let email = {
            "user":current_user.email,
            "raw":data
        }
        dispatch(postEmail(email))
        alert("Email Sent!")
    }

    useEffect(() => {
        if(google_login === 'true') {
            setContent(
                <div>
                <form onSubmit={sendEmail}>
                <div><input type='email' placeholder='To:' required></input></div>
                <div><input type='text' placeholder='subject'></input></div>
                <div><textarea placeholder='body'></textarea></div>
                <div><button type='submit'>Send Email</button></div>
              </form>
            </div>
            )
          } else if (google_login === 'false') {
            setContent(
              <div className='login_message'>
                <div>Please log in with google to continue</div>
                <div className='Loginbar'><GoogleLogin></GoogleLogin></div>
              </div>
            )
            return
          }
      }, [setContent,google_login])


    return (
        <div>
            {Content}
        </div>
    );
}

export default EmailFunctionality;