// ReplyComponent.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { createComment } from '../../actions/commentActions';
import { sendNotification } from '../../actions/notificationActions';

const ReplyComponent = ({ parentComment, post, current_user, dispatch }) => {
    const [newReply, setNewReply] = useState(''); 
    const [parentCommentReplies, setParentCommentReplies] = useState(parentComment.replies || []);

    useEffect(() => {
        setParentCommentReplies(parentComment.replies || []);
    }, [parentComment]);

    const handleAddReply = (event) => {
        event.preventDefault();
        if(newReply.trim() === '') {
            return;
        }
        const replyId = uuidv4();
        const newReplyData = {id: replyId, postId: post._id, parentCommentId: parentComment.id, user: current_user.email, reply: newReply};
        dispatch(createComment(newReplyData));
        dispatch(sendNotification({
            type : "reply",
            recipient : [parentComment.user],
            sender : current_user.email,
            content : {
                message: newReply,
                id: post._id
            }
        }))
        setParentCommentReplies([...parentCommentReplies, newReplyData]);
        setNewReply('');
    };

    return (
        <div className='replyContainer'>
            <div>
                {parentCommentReplies.slice().reverse().map((reply) => (
                    <div key={reply._id}>
                        <div><b>{reply.user.split('@')[0]}</b>: {reply.reply}</div>
                    </div>
                ))}
            </div>
            <div className='reply_bar'>
                <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Add a reply..."
                /> 
                <button onClick={(event) => handleAddReply(event)}>Submit</button>
            </div>
        </div>
    );
};

export default ReplyComponent;
