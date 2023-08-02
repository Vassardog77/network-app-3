//ported to react native
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CustomLink({ to, children, ...props }) {
    const navigation = useNavigation();
    const route = useRoute();
    
    const isActive = route.name === to;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(to)}
            {...props}
        >
            <Text>{isActive ? children : children}</Text>
        </TouchableOpacity>
    );
}
