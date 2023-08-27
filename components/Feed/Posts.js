import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePost } from '../../actions/posts';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo's FontAwesome for the icon
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LikeComponent from './LikeComponent';
import CommentComponent from './CommentComponent';
import CustomLink from "../../customComponents/CustomLink"; // Assuming this is refactored for React Native

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
    const current_user = JSON.parse(localStorage.getItem('user')); // You may want to consider using AsyncStorage in React Native
    const posts = useSelector((state) => state.posts);

    if (!posts || !Array.isArray(posts)) {
        return <Text>Loading posts...</Text>;
    }

    const postsToRender = singlePost ? [singlePost] : posts;

    return (
        <View style={{ padding: 20 }}>
            {postsToRender.slice().reverse().map((post, index) => 
                <Post key={index} post={post} current_user={current_user} dispatch={dispatch} />
            )}
        </View>
    );
}

export default Posts;
