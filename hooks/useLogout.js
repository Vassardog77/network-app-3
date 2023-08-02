//ported to react native
import { useAuthContext } from "./useAuthContext"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = async () => {
        // remove user from storage
        try {
            await AsyncStorage.removeItem('user')

            // dispatch logout action
            dispatch({type: 'LOGOUT'})
        } catch(e) {
            // error reading value
            console.error(e);
        }
    }
    return {logout}
}
