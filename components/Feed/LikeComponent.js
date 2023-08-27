// LikeComponent.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { likePost } from '../../actions/likeActions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
        <View style={styles.likeBar}>
            <TouchableOpacity 
                style={[styles.likeButton, likeState ? styles.liked : styles.notLiked]}
                onPress={handleLike}>
                <FontAwesome name="heart" style={styles.likeIcon} />
                <Text style={styles.likeCount}>
                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    likeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    liked: {
        color: 'red'
    },
    notLiked: {
        color: 'grey'
    },
    likeIcon: {
        fontSize: 20,
        marginRight: 5
    },
    likeCount: {
        fontSize: 16
    }
});

export default LikeComponent;
