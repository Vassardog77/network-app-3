//ported to react native
import * as api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendNotification = (config) => async (dispatch) => {
    try {
        const data = await api.sendNotification(config);
        dispatch({ type: 'SEND_NOTIFICATION', payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const deleteNotification = (config) => async (dispatch) => {
    try {
        const data = await api.deleteNotification(config);
        dispatch({ type: 'DELETE_NOTIFICATION', payload: data });

        // Updating the AsyncStorage with the new notifications data
        await AsyncStorage.setItem('notifications', JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}
