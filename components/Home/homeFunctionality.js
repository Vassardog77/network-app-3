import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { postCalendarEvent } from '../../actions/calendarActions'
import { useSelector } from 'react-redux'
import GoogleLogin from '../MediaLogin/GoogleLogin';

function HomeFunctionality(props) {
  const current_user = JSON.parse(localStorage.getItem('user'))
  let google_login = localStorage.getItem('google_login')
  const events = useSelector((state) => state.events)
  let [Content, setContent] = useState()

  const dispatch = useDispatch()      //establishing dispatch function (necessary for some reason)

  let postEvent = async (e) => {
    e.preventDefault()
    var cal_event = {"user": current_user.email,
      "data": {
        "summary": e.target[0].value,
        "location": e.target[1].value,
        "description": e.target[2].value,
        "start": {
          "dateTime": e.target[3].value+':00',
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        "end": {
          "dateTime": e.target[4].value+':00',
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }
    }
    dispatch(postCalendarEvent(cal_event))
    alert("Event Scehduled!")
  }


  useEffect(() => {
    if(google_login === 'true') {
        setContent(
          <div>
          <form onSubmit={postEvent}>
            <div><textarea placeholder='title'></textarea></div>
            <div><textarea placeholder='location'></textarea></div>
            <div><textarea placeholder='description'></textarea></div>
            <div>
            <input type="datetime-local" required></input>
            <input type="datetime-local" required></input>
            </div>
            <div><button type='submit'>Schedule Event</button></div>
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
        <div >
            {Content}
       </div>
    );
}

export default HomeFunctionality;