import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple } from '@fortawesome/free-solid-svg-icons'
import { Line } from 'react-chartjs-2'
import { Chart as Chartjs, LineElement, CategoryScale, LinearScale, PointElement,
ArcElement, Tooltip, Legend, BarElement} from 'chart.js'
import { base_url } from '../../api';
import '../../App.css';
const current_user = JSON.parse(localStorage.getItem('user'))
Chartjs.register( LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, BarElement)
function AnalyticsFunctionality(props) {

    const [Content, setContent] = useState()

    useEffect(() => {           
        axios.post(base_url+'/analytics/ig',
        {"user": current_user.email})
        .then(response => {
            console.log(response.data.data)
            let profile_views_data = response.data.data[0].values.map(value => value.value)
            let reach_data = response.data.data[1].values.map(value => value.value)
            let impressions_data = response.data.data[2].values.map(value => value.value)
            setContent(<div>
                {make_line_graph(profile_views_data,"Profile Views")}
                {make_line_graph(reach_data,"Reach")}
                {make_line_graph(impressions_data,"Impressions")}</div>)
        })
    }, [])

    let make_line_graph = (data,heading) => {
        const line_data = {
            labels: data,
            datasets: [{
                label: 'Users',
                data: data,
                backgroundColor: ['#ffe709', '#826af0','#19bb65', '#ffe709'],
                borderColor: 'black',
                pointBorderColor: '',
                //fill: 'true'
            }]
        }
        return (
            <div className='analytics_chart'>
                <div className='analytics_heading'>{heading}</div>
                <Line data = {line_data}options = {options} ></Line>
                <div className='analytics_subscript'>Last month</div>
            </div>)
    }

    //chart data
    const options = {
        plugins: {
            legend: false
        }
    }


    return (
        <div className='component_parent'>
            <div className = 'component_header'>Analytics <FontAwesomeIcon icon={faChartSimple}/></div>
            <div className='analytics'>
                {Content}
            </div>
        </div>
    )
}

export default AnalyticsFunctionality;