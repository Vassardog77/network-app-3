// CommentComponent.js
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { createComment } from '../../actions/commentActions';
import { sendNotification } from '../../actions/notificationActions';
import ReplyComponent from './ReplyComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faReply } from '@fortawesome/free-solid-svg-icons' 

const CommentComponent = ({ post, current_user, dispatch }) => {
    const [comment, setComment] = useState(''); 
    const [postComments, setPostComments] = useState(post.comments || []);
    const [showReplies, setShowReplies] = useState({}); // Changed this to an object

    const commentRef = useRef(null);

    useEffect(() => {
        setPostComments(post.comments || []);
    }, [post]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (commentRef.current && !commentRef.current.contains(event.target)) {
                setShowReplies({}); // Close all replies
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSubmitComment = (event) => {
        event.preventDefault();
        if(comment.trim() === '') {
            return;
        }
        const commentId = uuidv4(); 
        const newComment = {id: commentId, postId: post._id, user: current_user.email, comment: comment};
        dispatch(createComment(newComment));
        dispatch(sendNotification({
            type : "comment",
            recipient : [post.creator],
            sender : current_user.email,
            content : {
                message: comment,
                id: post._id
            }
        }))
        setPostComments([...postComments, newComment]);
        setComment('');
    };

    const toggleShowReplies = (commentId) => {
        setShowReplies((prevShowReplies) => ({
            ...prevShowReplies,
            [commentId]: !prevShowReplies[commentId],
        }));
    }

    return (
        <div ref={commentRef}>
            <div className='comment_bar'>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                /> 
                <button onClick={(event) => handleSubmitComment(event)}>Submit</button>
            </div>
            <div>
                {postComments.slice().reverse().map((cmt) => (
                    <div key={cmt._id}>
                        <div className='commentSection'>
                            <div className='commentText'><b>{cmt.user.split('@')[0]}</b>: {cmt.comment}</div>
                            <button onClick={() => toggleShowReplies(cmt.id)}>
                                <FontAwesomeIcon icon={faReply} />
                                {showReplies[cmt.id]}
                            </button>
                        </div>
                        {showReplies[cmt.id] && <ReplyComponent parentComment={cmt} post={post} current_user={current_user} dispatch={dispatch} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentComponent;
