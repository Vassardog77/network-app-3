import React, {useState} from 'react';
import axios from 'axios'
import { base_url } from '../../api';
function InstagramLogin(props) { 
    const current_user = JSON.parse(localStorage.getItem('user'))

    const [Pages, setPages] = useState({})
    const [Login,setLogin] = useState(false)

    let login = () => {                                         //(1st function run) getting facebook pages and related info
        axios.post(base_url+'/pages?',
        {
            "user": current_user.email
        })
        .then(response => {
            setPages(response.data)
            setLogin(true)
            //console.log(response.data)
        })
    }

    const [Content, setContent] = useState(<button onClick={login}>Insta Login</button>)

    const handleSubmit = (e) => {                               //(3rd and final function run) once page is selected, send information to the server
        axios.post(base_url+'/login/ig',
        { //setting request body
            "id": Pages[e.target.value].id,
             "access_token": Pages[e.target.value].access_token,
             "user": current_user.email
            })
        .then(response => {
            //console.log(response.data)
            setContent(<button onClick={login}>Logged In</button>)
            localStorage.setItem('instagram_login', true)
            setPages({})
        })
    }

        if(Login===true){                                                                   //(2nd function run) creating facebook page selector so that the user can select which facebook page is associated with their ig account
            var selector = [<option key='1' value=''>Choose a page</option>]
            for (var i = 0; i < Pages.length; i++) {
                    selector.push(<option key={[i+2]} value={i}>{Pages[i].name}</option>)
            }
            setContent(<select onChange={handleSubmit}>{selector}</select>) //change login button to page selector
        setLogin(false)
        }


    return (
        <div>
            {Content}
            <div className='insta_login_message'>
                <div>IMPORTANT NOTE, Instagram login will only work for an Instagram business account connected to a Facebook page on your Facebook account</div>
                <a href={`https://youtu.be/EgyDJSbsxMY`} target="_blank" rel="noopener noreferrer">If you don't know how to do that, check out instructions here</a>
            </div>
        </div>
    );
}

export default InstagramLogin;