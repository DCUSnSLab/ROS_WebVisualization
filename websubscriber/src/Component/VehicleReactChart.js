import React, {useEffect, useState} from "react";
import {
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { RealTimeScale, StreamingPlugin } from 'chartjs-plugin-streaming';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import * as ROSLIB from "roslib";
import ZoomPlugin from 'chartjs-plugin-zoom';
import { updateChartData } from '../features/PublishedTopics/PublishedTopicSlice';

Chart.register(
    ZoomPlugin,
    StreamingPlugin,
    RealTimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

    // const ip = useSelector((state) => state.TopicList.serverIP);
    // useSelector : publishedTopicSlice에 있는 값을 가져오는 훅

    
    // const listener = new ROSLIB.Topic({
    //     ros: ros,
    //     name: "/zed2/zed_node/pose",
    //     messageType: "geometry_msgs/PoseStamped"
    // });

function VehicleReactChart() {
    const [Pose, setPose] = useState([]);
    const [PoseX, setPoseX] = useState([]);
    const [PoseY, setPoseY] = useState([]);
    const [PoseZ, setPoseZ] = useState([]);

    useEffect(() => {
        const fetchData = () => {
          // Fetch data from stream (e.g., WebSocket)
          // Update chart data using Redux action
          const newData = {PoseX}
          updateChartData(newData);
    };

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, [updateChartData]);

    // useEffect(() => {
    //     listener.subscribe((message) => {
    //
    //
    //         setPoseX((PoseX) => [...PoseX, {x: Date.now(), y: message.pose.position.x}]);
    //         setPoseY((PoseY) => [...PoseY, {x: Date.now(), y: message.pose.position.y}]);
    //         setPoseZ((PoseZ) => [...PoseZ, {x: Date.now(), y: message.pose.position.z}]);
    //     })
    //     return () => {listener.unsubscribe();}
    // }, [listener]); // Add listener to the dependency array

    const interval = setInterval(() => {
        setPoseX((PoseX) => [...PoseX, {x: Date.now(), y: Pose[0]}]);
        setPoseY((PoseY) => [...PoseY, {x: Date.now(), y: Pose[1]}]);
        setPoseZ((PoseZ) => [...PoseZ, {x: Date.now(), y: Pose[2]}]);
        return() => clearInterval(interval)
    }, 1000)

    // useEffect(() => {
    //     listener.subscribe((message) => {
    //         setPose([...Pose, message.pose.position.x, message.pose.position.y, message.pose.position.z])
    //     })
    //     return () => {listener.unsubscribe();}
    // }, [listener]); // Add listener to the dependency array

    return (
    <div>
        {PoseX.length && PoseY.length && PoseZ.length ?
            <Line
            data={{
            datasets: [
                {
                label: 'PoseX',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [8, 4],
                fill: true,
                data: PoseX
                },
                {
                label: 'PoseY',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                cubicInterpolationMode: 'monotone',
                fill: true,
                data: PoseY
                },
                {
                label: 'PoseZ',
                backgroundColor: 'rgba(200, 200, 0, 0.5)',
                borderColor: 'rgba(200, 200, 0)',
                cubicInterpolationMode: 'monotone',
                fill: true,
                data: PoseZ
                }
            ],
            }}
            options={{
                animation: false,  // disable animations
            scales: {
                x: {
                type: 'realtime',
                    realtime: {
                        delay: 0
                    }},
                y: {
                    // min: -600,
                    // max: 600
                }
            },
            interaction: {
                intersect: false
            },
            plugins: {
                streaming: {
                    frameRate: 1   // chart is drawn 5 times every second
                },
              zoom: {
                  pan: {
                      enabled: true,
                      mode: 'y'
                  },
                  zoom: {
                      pinch: {
                          enabled: true
                      },
                      wheel: {
                          enabled: true
                      },
                      mode: 'y'
                  },
                  limits: {
                      x: {
                          // minDelay: -4000,
                          // maxDelay: 4000,
                          // minDuration: 1000,
                          // maxDuration: 20000
                      }
                  }}
            }}}
        /> : null}
    </div>
)}

export default VehicleReactChart;

