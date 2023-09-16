import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';



export const MyChart = ({ plot, setPlot, beams }) => {


    if (plot === null) {
        return (<div> ss</div>)
    }

    const plotData = () => {
        let bendingMoment = plot.bendingMoment
        let deformation = plot.deformation
        let original = plot.original
        let shearForce = plot.shearForce

        let x_original = Object.keys(original).map(parseFloat);
        let y_original = Object.values(original).map(parseFloat);
        let y_bendingMoment = Object.values(bendingMoment).map(parseFloat);
        let x_bendingMoment = Object.keys(bendingMoment).map(parseFloat);
        return { "x0": x_bendingMoment, "y0": y_original, "y": y_bendingMoment }
    }

    // let y_bendingMoment = Object.values(bendingMoment).map(parseFloat);
    // console.log("🚀 ~ y_bendingMoment:", x_bendingMoment)
    // console.log("🚀 ~ file: Chart.jsx:16 ~ MyChart ~ y_bendingMoment:", y_bendingMoment)


    const createChart = () => {
        const plot = plotData()
        const x_bendingMoment = plot.x0
        const y_original = plot.y0
        const y_bendingMoment = plot.y
        const chartData = {
            labels: x_bendingMoment,
            datasets: [
                {
                    label: 'Original',
                    data: y_original,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1,
                },
                {
                    label: 'BMD',
                    data: y_bendingMoment,
                    fill: true,
                    borderColor: 'rgba(192,75,192,1)',
                    tension: 0.1,
                },
            ],
        };
        // setChartData(chartData)
        return chartData
    };
    const [chartData, setChartData] = useState(createChart());

    useEffect(() => {
        updateChart()
    }, [plot]);

    const updateChart = () => {
        setChartData(createChart())
    };

    return (
        <div>
            <Line data={chartData} />
        </div>
    );
};

