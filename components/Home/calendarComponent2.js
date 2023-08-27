import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../../api';
import GoogleLogin from '../MediaLogin/GoogleLogin'; // Ensure this is compatible with React Native.
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function CalendarComponent2(props) {

    let [Calendar, setCalendar] = useState()
    let [MonthIncrement, setMonthIncrement] = useState(0)
    const current_user = JSON.parse(localStorage.getItem('user'))
    //initializing months
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const todays_date = new Date();
    let todays_date_iso = todays_date.toISOString().slice(0, 10)
   
    let current_month = (todays_date.getMonth()+1) //displays the Current Month (1-12)
    let start_of_month = new Date((current_month+MonthIncrement)+", 1, 2023").getDay()

    let next_month = () => {setMonthIncrement(MonthIncrement+1)} //function to change calendar to next month
    let previous_month = () => {setMonthIncrement(MonthIncrement-1)} //function to change calendar to previous month


    let initialize_calendar = () => {
        let days_in_last_month = new Date(2023, (current_month+MonthIncrement-1), 0).getDate()
        let days_in_current_month = new Date(2023, (current_month+MonthIncrement), 0).getDate()

        let calendar_array = []
        let day_count = 1 - start_of_month
        for (let i = 0; i < 35; i++) {
            if (day_count < 1) {//last months dates
                //creating first calendar array
                calendar_array.push({
                     "className":'calendar_element',
                    "id":'d2023-'+String(current_month+MonthIncrement-1).padStart(2, '0')+'-'+(days_in_last_month+day_count),
                    "key":i,
                    "content":days_in_last_month+day_count,
                })
                day_count++
            } else if (day_count > days_in_current_month){//next months dates
                calendar_array.push({
                    "className":'calendar_element', 
                    "id":'d2023-'+String(current_month+MonthIncrement+1).padStart(2, '0')+'-'+String(day_count-days_in_current_month).padStart(2, '0'), 
                    "key":i,
                    "content":day_count-days_in_current_month,
                })
                day_count++
            } else {//this months dates
                calendar_array.push({
                    "className":'calendar_element', 
                    "id":'d2023-'+String(current_month+MonthIncrement).padStart(2, '0')+'-'+String(day_count).padStart(2, '0'), 
                    "key":i,
                    "content":day_count,
                }) 
                day_count++
            }
        }
        return(calendar_array)
    }

    let add_current_date = (calendar_array) => { //adds a new class to the current date so it can be displayed differently 
        calendar_array.forEach(async element => {
            if (element.id === 'd'+todays_date_iso) {
                element.className = "calendar_element current_date"
            }
        })
        return(calendar_array)
    }

    let finalize_calendar = (calendar_array) => {
        let final_calendar_array = []
        //console.log(calendar_array)
            //loop through all 35 calendar elements
            for (let i = 0; i < 35; i++) {
                //if the current calendar element has any events
                if(calendar_array[i].events) {
                    let calendar_event_elements = []
                    //for each event that it has, push that event into the calendar_event_elements array as a div
                    calendar_array[i].events.forEach(async event => {
                        calendar_event_elements.push(
                            <div key={event.summary} className='calendar_event'>{event.summary}</div>
                        )
                        //console.log(event.summary)
                    })
                    //console.log(calendar_event_elements)
                    //then push the entire calendar element into the final_calendar_array which is an array for divs ready for display (including pushing each the calendar_event_elements array)
                    final_calendar_array.push(
                        <div
                        className={calendar_array[i].className}
                        key={i}>
                            <div className='element_content'>
                                {calendar_array[i].content}
                                {calendar_event_elements}
                            </div>
                        </div>
                    )
                } else {
                    //if no events, push calendar element into final_calendar_array without adding any events
                    final_calendar_array.push(
                        <div
                        className={calendar_array[i].className}
                        key={i}>
                            {calendar_array[i].content}
                        </div>
                    )
                }
            }
        return(final_calendar_array)
    }

    let add_events_callback = (calendar_array,events) => {
        calendar_array.forEach(async calendar_element => {
            events.forEach(async event_element => {
                if(event_element.start.dateTime) {
                    if (calendar_element.id.slice(1, 11) === event_element.start.dateTime.slice(0, 10)) {
                        if(calendar_element.events) {
                            calendar_element.events.push(event_element)
                        } else {
                            calendar_element.events = [event_element]
                        }
                    }
                }
            })
        })
    return(calendar_array)
    }

    let add_events = (calendar_array) => {//test
        axios.post(base_url+'/calendar/get',
            {"user": current_user.email}
        )
        .then(response => {
            let events = response.data.items
            let calendar_array_final = add_events_callback(calendar_array,events)
            let calendar_elements = finalize_calendar(calendar_array_final)
            setCalendar(<div className='calendar_parent'>{calendar_elements}</div>)
            //console.log(Calendar)
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
            localStorage.setItem('google_login', false);
        })
        
        return(calendar_array)
    }
    


    useEffect(() => { 
       let calednar_step1 = initialize_calendar()
       let calednar_step2 = add_current_date(calednar_step1)
       add_events(calednar_step2)
      }, [MonthIncrement,start_of_month,current_month])

      
   
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
        backgroundColor: 'white', // You can adjust this to match your website's theme.
    },
    calendarTopbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f4f4f4', // An approximation.
    },
    navButton: {
        padding: 10,
        backgroundColor: '#e0e0e0', // An approximation.
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
        backgroundColor: '#d0e0ff', // An approximation to make the current date stand out.
    },
    calendarEvent: {
        marginTop: 5,
        padding: 2,
        backgroundColor: '#e6ffe6', // Light green to indicate an event.
        borderRadius: 2,
    },
    loginMessage: {
        padding: 20,
        alignItems: 'center',
    },
    loginBar: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#d0d0d0', // An approximation.
        borderRadius: 4,
    },
    // You can continue defining styles for other parts of the component, and adjust as needed.
});

export default CalendarComponent2;