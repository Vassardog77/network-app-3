import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../../api';
import { useParams, Link } from 'react-router-dom';

function ProfileView(props) {
    const current_user = JSON.parse(localStorage.getItem('user'))
    const { id } = useParams();

    const [Img1, setImg1] = useState('')
    const [Orgname, setOrgname] = useState('')
    const [Img2, setImg2] = useState('')
    const [Contact, setContact] = useState('')
    const [Img3, setImg3] = useState('')
    const [Description, setDescription] = useState('')
    const [Img4, setImg4] = useState('')
    const [noProfile, setNoProfile] = useState(false)

    const fetchData = async () => { 
        console.log("getting the profile")
        const email = id ? id : current_user.email;

        await axios.post(base_url+'/profiles/get',
        {
            data: email
        })
        .then((response) => {
            console.log(response.data)
            if (response.data) {
                setImg1(response.data.img1)
                setOrgname(response.data.org_name)
                setImg2(response.data.img2)
                setContact(response.data.contact)
                setImg3(response.data.img3)
                setDescription(response.data.description)
                setImg4(response.data.img4)
                setNoProfile(false)
            } else {
                setNoProfile(true)
            }
        })
    }

    useEffect(()  => {
        fetchData()
    }, [])

    const messageLink = () => {
        // creating a comma separated list with a space after the comma, in alphabetical order
        const room = [current_user.email, id].sort().join(', ');
        return `/messages/${room}`;
    }

    const messageClass = noProfile ? 'message_link_no_profile' : 'message_link_with_profile';

    return (
        <div className="profile">
            {id && (
                <div className={messageClass}>
                    <Link to={messageLink()}><button>Message</button></Link>
                </div>
            )}
            {noProfile ? (
                <div className='no_profile_message'>No profile yet</div>
            ) : (
                <>
                    <div className='profile_logo'><img src={Img1} alt=""></img></div>
                    <div className='profile_orgname'>{Orgname}</div>
                    <div className='profile_maincontent'>
                        <div className='profile_contact'>{Contact}<img src={Img2} alt=""></img></div>
                        <div className='profile_description'><img src={Img3} alt=""></img>{Description}</div>
                    </div>
                    <div className='profile_bottom_img'><img src={Img4} alt=""></img></div>
                </>
            )}
        </div>
    );
}

export default ProfileView;
