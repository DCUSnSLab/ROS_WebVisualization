import React, {useEffect, useState} from "react";
import * as ROSLIB from "roslib";
import {useSelector} from "react-redux";

import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "chartjs-adapter-luxon";
import ChartStreaming from "chartjs-plugin-streaming";


function VehicleReactChart() {
    const [Pose, setPose] = useState([]);
    const [PoseX, setPoseX] = useState([]);
    const [PoseY, setPoseY] = useState([]);
    const [PoseZ, setPoseZ] = useState([]);

  //   useEffect(() => {
  //       const fetchData = () => {
  //         // Fetch data from stream (e.g., WebSocket)
  //         // Update chart data using Redux action
  //         const newData = {PoseX}
  //         updateChartData(newData);
  //   };
  //
  //   const interval = setInterval(fetchData, 1000);
  //
  //   return () => clearInterval(interval);
  // }, [updateChartData]);

    const ip = useSelector((state) => state.ipServerReducer.VisualizeSystemAddress);

    useEffect(() => {

        const ros = new ROSLIB.Ros({
            url: ip
        });

        const listener = new ROSLIB.Topic({
          ros: ros,
          name: '/zed2/zed_node/pose',
          messageType: 'geometry_msgs/PoseStamped'
        });

        listener.subscribe((message) => {
            setPoseX((PoseX) => [...PoseX, {x: Date.now(), y: message.pose.position.x}]);
            setPoseY((PoseY) => [...PoseY, {x: Date.now(), y: message.pose.position.y}]);
            setPoseZ((PoseZ) => [...PoseZ, {x: Date.now(), y: message.pose.position.z}]);
        })
        return () => {listener.unsubscribe();}
    }, []); // Add listener to the dependency array

    // const interval = setInterval(() => {
    //     setPoseX((PoseX) => [...PoseX, {x: Date.now(), y: Pose[0]}]);
    //     setPoseY((PoseY) => [...PoseY, {x: Date.now(), y: Pose[1]}]);
    //     setPoseZ((PoseZ) => [...PoseZ, {x: Date.now(), y: Pose[2]}]);
    //     return() => clearInterval(interval)
    // }, 1000)

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
                    },
                    y: {
                        min: -600,
                        max: 600
                    }
                },
                interaction: {
                    intersect: false
                },
                plugins: {
                    streaming: {
                        frameRate: 1
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
                              minDelay: -4000,
                              maxDelay: 4000,
                              minDuration: 1000,
                              maxDuration: 20000
                          }
                      }}
            }}}
        /> : null}
    </div>
)}

export default VehicleReactChart;

