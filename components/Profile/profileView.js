import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { base_url } from '../../api';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importing AsyncStorage

function ProfileView(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params || {};

    const [currentUser, setCurrentUser] = useState(null); // Set initial value to null
    const [Img1, setImg1] = useState('');
    const [Orgname, setOrgname] = useState('');
    const [Img2, setImg2] = useState('');
    const [Contact, setContact] = useState('');
    const [Img3, setImg3] = useState('');
    const [Description, setDescription] = useState('');
    const [Img4, setImg4] = useState('');
    const [noProfile, setNoProfile] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                const parsedUser = JSON.parse(user);
                setCurrentUser(parsedUser);
                return parsedUser;
            } catch (error) {
                console.log("Error fetching user from AsyncStorage:", error);
                return null;
            }
        }
    
        const fetchData = async (userEmail) => {
            const email = id ? id : userEmail;
    
            await axios.post(base_url+'/profiles/get', { data: email })
            .then((response) => {
                if (response.data) {
                    //console.log(response.data)
                    setImg1(response.data.img1);
                    setOrgname(response.data.org_name);
                    setImg2(response.data.img2);
                    setContact(response.data.contact);
                    setImg3(response.data.img3);
                    setDescription(response.data.description);
                    setImg4(response.data.img4);
                    setNoProfile(false);
                } else {
                    setNoProfile(true);
                }
            });
        };
    
        fetchUser().then(user => {
            if (user) {
                fetchData(user.email);
            }
        });
    }, []);

    const messageLink = () => {
        const room = [currentUser.email, id].sort().join(', ');
        navigation.navigate('Messages', { room });
    };

    return (
        <View style={styles.profile}>
            {id && (
                <Button title="Message" onPress={messageLink} />
            )}
            {noProfile ? (
                <Text>No profile yet</Text>
            ) : (
                <>
                    <Image source={{ uri: Img1 }} style={styles.profileLogo} />
                    <Text style={styles.profileOrgname}>{Orgname}</Text>
                    <View style={styles.profileMaincontent}>
                        <Text style={styles.profileContact}>{Contact}</Text>
                        <Image source={{ uri: Img2 }} style={styles.image} />
                        <Text style={styles.profileDescription}>{Description}</Text>
                        <Image source={{ uri: Img3 }} style={styles.image} />
                    </View>
                    <Image source={{ uri: Img4 }} style={styles.profileBottomImg} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        padding: 15,
        alignItems: 'center'
    },
    profileLogo: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    profileOrgname: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },
    profileMaincontent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },
    profileContact: {
        fontSize: 16
    },
    profileDescription: {
        fontSize: 14
    },
    image: {
        width: 50,
        height: 50
    },
    profileBottomImg: {
        width: '100%',
        height: 150
    }
});

export default ProfileView;
