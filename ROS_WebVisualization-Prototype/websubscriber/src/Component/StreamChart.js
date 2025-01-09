import React, {useEffect, useState} from "react";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import * as ROSLIB from "roslib";
import Chart from 'chart.js/auto';
import {useSelector} from "react-redux";

Chart.register(StreamingPlugin);

export default function Stream() {
    const [PoseX, setPoseX] = useState([]);
    const [PoseY, setPoseY] = useState([]);
    const [PoseZ, setPoseZ] = useState([]);

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
        });
    }, []);

  return (
    <Line
      data={{
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            data: PoseX,
          },
          {
            label: "Dataset 2",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgb(54, 162, 235)",
            cubicInterpolationMode: "monotone",
            data: PoseY,
          },
            {
            label: "Dataset 3",
            backgroundColor: "rgba(255, 255, 0, 0.5)",
            borderColor: "rgb(190, 190, 0, 0.5)",
            cubicInterpolationMode: "monotone",
            data: PoseZ,
          },
        ],
      }}
      options={{
        scales: {
          x: {
            type: "realtime",
            realtime: {
              delay: 5000,
              onRefresh: (chart) => {
                chart.data.datasets.forEach((dataset) => {
                });
              },
            },
          },
          y: {
            min: -1000,
            max: 1000
          }
        },
      }}
    />
  );
}
