import React, {useState,useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getDcLogin } from '../../actions/loginActions'

function DiscordLogin(props) {
    const [ButtonMessage, setButtonMessage] = useState("Discord Login")
    const current_user = JSON.parse(localStorage.getItem('user'))
    const [searchParams] = useSearchParams()
    let access_code_pending = sessionStorage.getItem('disc_code_pending')
    const dispatch = useDispatch()      //establishing dispatch function (necessary for some reason)

    let login = () => {  //using login redirect to get code
        var url = encodeURIComponent(window.location.origin + "/social-add")
        window.location.replace("https://discord.com/api/oauth2/authorize?response_type=code&client_id=1012896743429513367&scope=messages.read%20guilds.members.read%20guilds&state=15563059ghq9183habn&redirect_uri="+url+"&prompt=consent")
        sessionStorage.setItem('disc_code_pending', 'pending')
    }


        if(access_code_pending === ('pending')){
                sessionStorage.removeItem("disc_code_pending");
                
                let code = searchParams.get("code")
                let redirect_uri = window.location.origin + "/social-add"
                
                let config = {
                    "code":code,
                    "redirect_uri":redirect_uri,
                    "user": current_user.email
                }
                dispatch(getDcLogin(config))
            }

    
            useEffect(() => {
                if(localStorage.getItem('discord_login') === 'true') {
                    setButtonMessage("Logged in")
                  } else if (localStorage.getItem('discord_login') === 'false') {
                    setButtonMessage("Discord Login")
                  }
            }, [setButtonMessage])

    return (
        <div>
            <button onClick={login}>{ButtonMessage}</button>
        </div>
    );
}

export default DiscordLogin;