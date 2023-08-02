// LikeComponent.js
import React, { useState, useEffect } from 'react';
import { likePost } from '../../actions/likeActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const LikeComponent = ({ post, current_user, dispatch }) => {
    const [likeState, setLikeState] = useState(false); 
    const [likeCount, setLikeCount] = useState(post.likes.likeCount || 0); 

    useEffect(() => {
        if (post.likes && post.likes.likeArray.includes(current_user.email)) {
            setLikeState(true);
        } else {
            setLikeState(false);
        }
        setLikeCount(post.likes.likeCount || 0);
    }, [post, current_user]);

    const handleLike = () => {
        setLikeState(!likeState);
        setLikeCount(likeState ? likeCount - 1 : likeCount + 1);

        const newLike = {
            id: post._id, 
            user: current_user.email, 
            adding: !likeState
        }; 
        dispatch(likePost(newLike));
    };

    return (
        <div className='like_bar'>
            <button onClick={handleLike} style={likeState ? {color: 'red'} : {color: 'grey'}}> 
                <FontAwesomeIcon icon={faHeart} className="likeIcon"/>
                <span className="likeCount">{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
        </div>
    );
};

export default LikeComponent;
