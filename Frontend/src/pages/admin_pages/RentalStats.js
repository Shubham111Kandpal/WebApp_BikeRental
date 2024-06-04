import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import '../css/RentalStats.css'; 

function RentalStats() {
    const [data, setData] = useState({
        seasonData: [],
        averages: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8003/rentals');
                processData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const processData = (rawData) => {
            let sumTemp = 0, sumAtemp = 0, sumHumidity = 0, sumWindSpeed = 0, sumCount = 0;
            const seasonCounts = {};

            rawData.forEach(item => {
                sumTemp += item.temp;
                sumAtemp += item.atemp;
                sumHumidity += item.humidity;
                sumWindSpeed += item.windspeed;
                sumCount += item.count;
                seasonCounts[item.season] = (seasonCounts[item.season] || 0) + item.count;
            });

            const numItems = rawData.length;
            setData({
                seasonData: Object.keys(seasonCounts).map(key => ({ x: `Season ${key}`, y: seasonCounts[key] })),
                averages: [
                    sumTemp / numItems,
                    sumAtemp / numItems,
                    sumHumidity / numItems,
                    sumWindSpeed / numItems,
                    sumCount / numItems
                ]
            });
        };

        fetchData();
    }, []);

    return (
        <div className="charts-container">
            <div>
                <h3>Average Values Overview</h3>
                <Bar data={{
                    labels: ['Average Temperature', 'Average Feels-like Temperature', 'Average Humidity', 'Average Wind Speed', 'Average Rentals'],
                    datasets: [{
                        label: 'Average Values',
                        data: data.averages,
                        backgroundColor: [
                            'red',
                            'blue',
                            'orange',
                            'cyan',
                            'purple'
                        ],
                        hoverBackgroundColor: [
                            'rgba(255, 99, 132, 0.75)',
                            'rgba(54, 162, 235, 0.75)',
                            'rgba(255, 206, 86, 0.75)',
                            'rgba(75, 192, 192, 0.75)',
                            'rgba(54, 162, 235, 0.75)'
                        ],
                        borderColor: [
                            'black',
                            'black',
                            'black',
                            'black',
                            'black'
                        ],
                        borderWidth: 1
                    }]
                }} options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }} />
            </div>
            <div>
                <h3>Rentals by Season</h3>
                <Bar data={{
                    labels: data.seasonData.map(s => s.x),
                    datasets: [{
                        label: 'Rentals per Season',
                        data: data.seasonData.map(s => s.y),
                        backgroundColor: [
                            'pink',
                            'blue',
                            'yellow',
                            'cyan'
                        ],
                        hoverBackgroundColor: [
                            'rgba(255, 99, 132, 0.75)',
                            'rgba(54, 162, 235, 0.75)',
                            'rgba(255, 206, 86, 0.75)',
                            'rgba(75, 192, 192, 0.75)'
                        ],
                        borderColor: [
                            'black',
                            'black',
                            'black',
                            'black'
                        ],
                        borderWidth: 1
                    }]
                }} options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }} />
            </div>
        </div>
    );
}

export default RentalStats;
