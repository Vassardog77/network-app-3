import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { getPosts } from '../../actions/posts'
import Posts from './Posts'

const current_user = JSON.parse(localStorage.getItem('user'))

function Feed() {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getPosts())
    }, [dispatch])


    function navigateToCreatePost() {
        navigate('/create_post');
    }

    return (
        <div>
            <div className='component_parent'>
                <div className = 'component_header'>Feed <FontAwesomeIcon icon={faListUl}/></div>
                {current_user.account_type !== 'student' && (
                  <div className='create_buttons'><button onClick={navigateToCreatePost}>+ Create Post</button></div>
                )}
                <Posts></Posts>
                <div className='spacer'></div>
            </div>
        </div>
    );
}

export default Feed;
