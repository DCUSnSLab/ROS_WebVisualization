import ChartStreaming from 'chartjs-plugin-streaming';
import React, {useEffect, useRef, useState} from 'react';
import { Line, Chart } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import * as ROSLIB from 'roslib';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

ChartJS.register(ChartStreaming);

export default function Plot() {

  const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
  });

  const pose = new ROSLIB.Topic({
    ros: ros,
    name: '/zed2/zed_node/pose',
    messageType: 'geometry_msgs/PoseStamped',
  });

  const [x_pose, setX] = useState();
  const [y_pose, setY] = useState();
  const [z_pose, setZ] = useState();

  const chartRef = useRef();

  useEffect( () => {
    pose.subscribe(function (message) {
    setInterval(() => {
      setX(message.pose.position.x);
      setY(message.pose.position.y);
      setZ(message.pose.position.z);
      }, 1000);
    });
  }, []);

  const onRefresh = chart => {
    const now = Date.now();
    const arr = [x_pose, y_pose, z_pose];
    chart.data.datasets.forEach(dataset => {
      dataset.data.push({
        x: now,
        y: {arr}
      });
      console.log(arr)
    });
  };

  const data = {
    datasets: [
      {
        label: 'x',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        data: []
      },
      {
        label: 'y',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        data: []
      },
      {
        label: 'z',
        backgroundColor: 'rgba(255, 187, 000, 0.5)',
        borderColor: 'rgb(255, 187, 000)',
        data: []
        }
  ]}


  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      x: {
        type: 'realtime',
        realtime: {
          // duration: 20000,
          // refresh: 1000,
          // delay: 2000,
          onRefresh: onRefresh
        }
      },
      y: {
        min: -100,
        max: 100
      }
    }
  };

  return <Line ref={chartRef} options={options} data={data} />;
}
