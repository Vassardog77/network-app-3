import React from 'react';
import DiscordLogin from './DiscordLogin';
import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GoogleLogin';
import InstagramLogin from './InstagramLogin';

function Loginbar(props) {
    return (
        <div className='Loginbar'>
            <FacebookLogin></FacebookLogin>
            <GoogleLogin></GoogleLogin>
            <InstagramLogin></InstagramLogin>
            {/*<DiscordLogin></DiscordLogin>*/}
        </div>
    );
}

export default Loginbar;