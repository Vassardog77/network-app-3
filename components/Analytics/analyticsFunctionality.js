import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';  // This is assuming you're using Expo. Adjust accordingly.
import { LineChart } from 'react-native-chart-kit';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../../api';

const screenWidth = Dimensions.get("window").width;

function AnalyticsFunctionality(props) {
    const [Content, setContent] = useState();

    useEffect(() => {
        (async () => {
            const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
            axios.post(base_url + '/analytics/ig', { "user": currentUser.email })
                .then(response => {
                    let profile_views_data = response.data.data[0].values.map(value => value.value);
                    let reach_data = response.data.data[1].values.map(value => value.value);
                    let impressions_data = response.data.data[2].values.map(value => value.value);
                    setContent(
                        <View>
                            {make_line_graph(profile_views_data, "Profile Views")}
                            {make_line_graph(reach_data, "Reach")}
                            {make_line_graph(impressions_data, "Impressions")}
                        </View>
                    );
                });
        })();
    }, []);

    const make_line_graph = (data, heading) => {
        const line_data = {
            labels: data,  // this might need adjustment based on your data's format
            datasets: [{
                data: data,
                color: (opacity = 1) => 'rgba(0, 0, 0, ' + opacity + ')',
            }]
        };
        return (
            <View style={styles.analytics_chart}>
                <Text style={styles.analytics_heading}>{heading}</Text>
                <LineChart
                    data={line_data}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => 'rgba(0, 0, 0, ' + opacity + ')',
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={styles.chart}
                />
                <Text style={styles.analytics_subscript}>Last month</Text>
            </View>
        );
    };

    return (
        <View style={styles.component_parent}>
            <View style={styles.component_header}>
                <Text>Analytics</Text>
                <FontAwesome name="chart" size={24} color="black" />
            </View>
            <View style={styles.analytics}>
                {Content}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    component_parent: {
        flex: 1,
        padding: 20
    },
    component_header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    analytics: {
        flex: 1
    },
    analytics_chart: {
        marginBottom: 20
    },
    analytics_heading: {
        fontSize: 18,
        marginBottom: 10
    },
    analytics_subscript: {
        fontSize: 14,
        marginTop: 10
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16
    }
});

export default AnalyticsFunctionality;
