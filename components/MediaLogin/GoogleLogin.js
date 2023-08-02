import React, {useState,useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getGLogin } from '../../actions/loginActions'

function GoogleLogin(props) { 
    const [ButtonMessage, setButtonMessage] = useState("Google Login")
    const current_user = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch()      //establishing dispatch function (necessary for some reason)
    let google_login = localStorage.getItem('google_login')

    const [searchParams] = useSearchParams()
    let access_code_pending = sessionStorage.getItem('g_code_pending')

    let login = () => {  //using login redirect to get code
        let redirect_uri = window.location.origin + "/social-add"
        window.location.replace("https://accounts.google.com/o/oauth2/v2/auth?client_id=419138563147-lblak6s03v4i6lssberpm1vr4gqg000b.apps.googleusercontent.com&redirect_uri="+redirect_uri+"&response_type=code&scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.events")
        sessionStorage.setItem('g_code_pending', 'pending')
    }


        if(access_code_pending === ('pending')){
                sessionStorage.removeItem("g_code_pending");
                let code = searchParams.get("code")
                let redirect_uri = window.location.origin + "/social-add"
                
                let config = {
                    "code":code,
                    "redirect_uri":redirect_uri,
                    "user": current_user.email
                }
                dispatch(getGLogin(config))
            }

        useEffect(() => {
            if(google_login === 'true') {
                setButtonMessage("Logged in")
              } else if (google_login === 'false') {
                setButtonMessage("Google Login")
              }
        }, [google_login])


    return (
        <div>
            <button onClick={login}>{ButtonMessage}</button>
        </div>
    );
}

export default GoogleLogin;