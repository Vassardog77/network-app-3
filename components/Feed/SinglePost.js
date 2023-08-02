import React, { useEffect } from 'react';
import { getPosts } from '../../actions/posts'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteNotification } from '../../actions/notificationActions';
import Posts from './Posts';

function SinglePost(props) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications);
    const current_user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch])

    const posts = useSelector((state) => state.posts);
    const post = posts.find(post => post._id === id);

    useEffect(() => {
        if(post){
            let newNotifications = Array.isArray(notifications) ? notifications.filter((notification) => {
                // Check if the notification is for 'comment' or 'reply' type and the post id matches with notification content id.
                if ((notification.type === 'comment' || notification.type === 'reply') && notification.content.id === post._id) {
                    // If match found, dispatch the deleteNotification action
                    dispatch(deleteNotification({user: current_user.email, unreads: notification}));
                    return false; 
                }
                return true;
            }) : [];
        }
    }, [post, notifications, dispatch]);

    if (!post) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Posts post={post} />
        </div>
    );
}

export default SinglePost;
