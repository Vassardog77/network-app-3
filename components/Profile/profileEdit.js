import React, { useState } from 'react';
import { postProfile } from '../../actions/profileActions'
import { useDispatch } from 'react-redux';
import imageCompression from 'browser-image-compression';

function ProfileEdit(props) {

    const [Img1, setImg1] = useState('')
    const [Img2, setImg2] = useState('')
    const [Img3, setImg3] = useState('')
    const [Img4, setImg4] = useState('')
    
    const dispatch = useDispatch()
    const current_user = JSON.parse(localStorage.getItem('user'))

    let post_profile = async (e) => {
        e.preventDefault()
        let profile = ({
            "user":current_user.email,
            "img1":Img1,
            "org_name":e.target[1].value,
            "img2":Img2,
            "contact":e.target[3].value,
            "img3":Img3,
            "description":e.target[5].value,
            "img4":Img4
        })
        alert("Profile Updated!")
        dispatch(postProfile(profile))
    }

    const handleImageUpload = async (e, setImage) => {
        const imageFile = e.target.files[0];
        const options = {
          maxSizeMB: 0.25, // (0.25 MB = 250 KB), max file size
          maxWidthOrHeight: 1920, // compress the image to 1080p
          useWebWorker: true
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
          const base64Img = await imageCompression.getDataUrlFromFile(compressedFile);
          setImage(base64Img)
        } catch (error) {
          console.log('Error occurred while compressing the image: ', error);
        }
      }

    return (
        <div className='profile_edit'>
            <form onSubmit={post_profile}>
                <div>Add image(s):<input type='file' accept="image/*" onChange={(e) => handleImageUpload(e, setImg1)}/></div>
                <div><textarea placeholder='Organization Name'></textarea></div>
                <div>Add image(s):<input type='file' accept="image/*" onChange={(e) => handleImageUpload(e, setImg2)}/></div>
                <div>Where to Contact Us</div>
                <div><textarea placeholder='Contact information'></textarea></div>
                <div>Add image(s):<input type='file' accept="image/*" onChange={(e) => handleImageUpload(e, setImg3)}/></div>
                <div><textarea placeholder='Description'></textarea></div>
                <div>Add image(s):<input type='file' accept="image/*" onChange={(e) => handleImageUpload(e, setImg4)}/></div>
                <div><button type='submit'>Save Profile</button></div>
            </form>
        </div>
    );
}

export default ProfileEdit;
