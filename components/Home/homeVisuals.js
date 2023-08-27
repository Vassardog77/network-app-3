import React, { useState, useEffect, useRef } from 'react';
import { View, Button, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import CalendarComponent2 from './calendarComponent2';
import HomeFunctionality from './homeFunctionality';
import { useNavigation } from '@react-navigation/native';

function HomeVisuals(props) {
    const popupRef = useRef();
    const navigation = useNavigation();
    const [showPopup, setShowPopup] = useState(false);

    function display() {
        setShowPopup(!showPopup);
    }

    function navigateToCreatePost() {
        navigation.navigate('CreatePost'); // Assuming 'CreatePost' is the name of the route you want to navigate to.
    }

    return (
        <View style={styles.home}>
            <View style={styles.home_post_buttons}>
                <Button title="+ Create Post" onPress={navigateToCreatePost} />
                <Button title="+ Create Event" onPress={display} />
                {showPopup && (
                    <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
                        <View ref={popupRef} style={styles.popup}>
                            <HomeFunctionality />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
            <CalendarComponent2 />
        </View>
    );
}

const styles = StyleSheet.create({
    home: {
        // Add styles specific to the 'home' class from your CSS.
    },
    home_post_buttons: {
        // Add styles specific to the 'home_post_buttons' class from your CSS.
    },
    popup: {
        // Add styles specific to the 'popup' ID from your CSS.
    }
});

export default HomeVisuals;
