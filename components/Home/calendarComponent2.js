import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../../api';
import GoogleLogin from '../MediaLogin/GoogleLogin'; // Ensure this is compatible with React Native.
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CalendarComponent2(props) {

    let [Calendar, setCalendar] = useState()
    let [MonthIncrement, setMonthIncrement] = useState(0)
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                setCurrentUser(JSON.parse(user));
            } catch (error) {
                console.log("Error fetching user from AsyncStorage:", error);
            }
        }
        fetchUser();
    }, []);

    // Initializing months
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const todays_date = new Date();
    let todays_date_iso = todays_date.toISOString().slice(0, 10)
   
    let current_month = (todays_date.getMonth()+1) // Displays the Current Month (1-12)
    let start_of_month = new Date((current_month+MonthIncrement)+", 1, 2023").getDay()

    let next_month = () => { setMonthIncrement(MonthIncrement+1) } // Function to change calendar to next month
    let previous_month = () => { setMonthIncrement(MonthIncrement-1) } // Function to change calendar to previous month

    // ... (The rest of your functions remain unchanged)

    let add_events = (calendar_array) => {
        axios.post(base_url+'/calendar/get', { "user": currentUser.email })
        .then(response => {
            let events = response.data.items
            let calendar_array_final = add_events_callback(calendar_array, events)
            let calendar_elements = finalize_calendar(calendar_array_final)
            setCalendar(<div className='calendar_parent'>{calendar_elements}</div>)
        })
        .catch(error => {
            // Log the detailed error information to the console
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
        
            // Regardless of the error type, display the Google login prompt
            setCalendar(
              <div className='login_message'>
                <div>Please log in with google to continue</div>
                <div className='Loginbar'><GoogleLogin /></div>
              </div>
            );
            AsyncStorage.setItem('google_login', 'false');
        })
        return(calendar_array)
    }
    
    useEffect(() => { 
       let calendar_step1 = initialize_calendar()
       let calendar_step2 = add_current_date(calendar_step1)
       add_events(calendar_step2)
      }, [MonthIncrement, start_of_month, current_month, currentUser])

    return (
        <View style={styles.home}>
            <View style={styles.calendarTopbar}>
                <TouchableOpacity style={styles.navButton} onPress={previous_month}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text>{months[(current_month+MonthIncrement-1)]}</Text>
                <TouchableOpacity style={styles.navButton} onPress={next_month}>
                    <Text>{'>'}</Text>
                </TouchableOpacity>
            </View>
            {Calendar}
        </View>
    );
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    calendarTopbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f4f4f4',
    },
    navButton: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    calendarElement: {
        padding: 5,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        borderRadius: 4,
    },
    currentDate: {
        backgroundColor: '#d0e0ff',
    },
    calendarEvent: {
        marginTop: 5,
        padding: 2,
        backgroundColor: '#e6ffe6',
        borderRadius: 2,
    },
    loginMessage: {
        padding: 20,
        alignItems: 'center',
    },
    loginBar: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
    }
});

export default CalendarComponent2;
