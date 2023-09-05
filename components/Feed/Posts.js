import React, {useState,useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePost } from '../../actions/posts';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo's FontAwesome for the icon
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LikeComponent from './LikeComponent';
import CommentComponent from './CommentComponent';
import CustomLink from "../../customComponents/CustomLink"; // Assuming this is refactored for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

function Post({ post, current_user, dispatch }) {
    if (!post) {
        return null; // return null or a loader here
    }

    return (
        <View style={{ marginBottom: 20 }}>
            <CustomLink to={"/profile/" + post.creator}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: post?.profile_pic || 'defaultPicLinkHere' }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    <Text>{post.creator.split('@')[0]}</Text>
                </View>
            </CustomLink>
            <View>
                <Image source={{ uri: post.selectedFile }} style={{ width: '100%', height: 200 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>{post.message}</Text>
                    {post.creator === current_user.email && 
                    <TouchableOpacity onPress={() => dispatch(deletePost(post._id))}>
                        <FontAwesome name="trash" size={24} color="black" />
                    </TouchableOpacity>}
                </View>
                <LikeComponent post={post} current_user={current_user} dispatch={dispatch} />
                <CommentComponent post={post} current_user={current_user} dispatch={dispatch} />
            </View>
        </View>
    );
}

function Posts({ post: singlePost }) {
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null); // State to hold current user info
    const posts = useSelector((state) => state.posts);

    useEffect(() => {
        // Fetch user from AsyncStorage and update state
        AsyncStorage.getItem('user')
            .then(user => {
                setCurrentUser(JSON.parse(user));
            })
            .catch(error => {
                console.error("Error fetching user from AsyncStorage:", error);
            });
    }, []); // The empty array means this useEffect will only run once, similar to componentDidMount

    if (!posts || !Array.isArray(posts)) {
        return <Text>Loading posts...</Text>;
    }

    const postsToRender = singlePost ? [singlePost] : posts;

    return (
        <View style={{ padding: 20 }}>
            {postsToRender.slice().reverse().map((post, index) => 
                <Post key={index} post={post} current_user={currentUser} dispatch={dispatch} />
            )}
        </View>
    );
}

export default Posts;
