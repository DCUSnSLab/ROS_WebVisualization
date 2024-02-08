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

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});
 const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/zed2/zed_node/pose",
    messageType: "geometry_msgs/PoseStamped"
});

function VehicleReactChart() {
    const [Pose, setPose] = useState([]);
    const [PoseX, setPoseX] = useState([]);
    const [PoseY, setPoseY] = useState([]);
    const [PoseZ, setPoseZ] = useState([]);

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

    useEffect(() => {
        listener.subscribe((message) => {
            setPose([...Pose, message.pose.position.x, message.pose.position.y, message.pose.position.z])
        })
        return () => {listener.unsubscribe();}
    }, [listener]); // Add listener to the dependency array

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


// import moment from 'moment';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
//
// import { Line } from 'react-chartjs-2';
// import * as ROSLIB from "roslib";
//
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );
//
//
// const options = {
//   responsive: true,
//   interaction: {
//     // mode: 'index' as const,
//     intersect: false,
//   },
//   stacked: false,
//   plugins: {
//     title: {
//       display: true,
//       text: 'Chart.js Line Chart - Multi Axis',
//     },
//   },
//   scales: {
//       x: {
//
//     },
//     y: {
//      min: -100,
//      max: 100
//     }
//   },
// };
//
//
// export default function VehicleReactChart() {
//     const ros = new ROSLIB.Ros({
//         url : 'ws://localhost:9090'
//     });
//      const listener = new ROSLIB.Topic({
//         ros: ros,
//         name: "/zed2/zed_node/pose",
//         messageType: "geometry_msgs/PoseStamped"
//     });
//      const config = {
//       type: 'line',
//       data: data,
//     };
//      const labels = Utils.months({count: 7});
// const data = {
//   labels: labels,
//   datasets: [{
//     label: 'My First Dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//     fill: false,
//     borderColor: 'rgb(75, 192, 192)',
//     tension: 0.1
//   }]
// };
//     function addData(chart, label, newData) {
//         chart.data.labels.push(label);
//         chart.data.datasets.forEach((dataset) => {
//             dataset.data.push(newData);
//         });
//         chart.update();
//     }
//     const [PoseX, setPoseX] = useState();
//     const [PoseY, setPoseY] = useState();
//     const [PoseZ, setPoseZ] = useState();
//
//     useEffect(() => {
//         listener.subscribe((message) => {
//             setPoseX(message.data.pose.position[0])
//             setPoseY(message.data.pose.position[1])
//             setPoseZ(message.data.pose.position[2])
//         });
//         addData()
//     }, []);
//
// const data = {
//   // labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       // data: {y: {PoseX} },
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       borderColor: 'rgb(53, 162, 235)',
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//     {
//       label: 'Dataset 3',
//       borderColor: 'rgb(234,111,0)',
//       backgroundColor: 'rgba(234,555,0)',
//     },
//   ],
// };
//   return <Line options={options} data={data} updateMode={"active"}/>;
// }
//
//
//
// // const data = {
// //   datasets: [
// //     {
// //       label: "Dataset 1 (linear interpolation)",
// //       backgroundColor: "#FF0000",
// //       borderColor: "#FF0000",
// //       fill: false,
// //       lineTension: 0,
// //       data: [{x: '', y: 0}]
// //     },
// //     {
// //       label: "Dataset 2 (linear interpolation)",
// //       backgroundColor: "#00FF00",
// //       borderColor: "#00FF00",
// //       fill: false,
// //       lineTension: 0,
// //       data: [{x: '', y: 0}]
// //     },
// //     {
// //       label: "Dataset 3 (linear interpolation)",
// //       fill: false,
// //       backgroundColor: "#FFFF00",
// //       borderColor: "#FFFF00",
// //       lineTension: 0,
// //       data: [{x: '', y: 0}]
// //     },
// //   ],
// // };
// //
// // const options = {
// //   elements: {
// //     line: {
// //       tension: 0.5,
// //     },
// //   },
// //   scales: {
// //     xAxes: [
// //       {
// //         type: "realtime",
// //         distribution: "linear",
// //         realtime: {
// //           onRefresh: function (chart) {
// //             chart.data.datasets[0].data.push({
// //                 x: moment(),
// //                 y: Math.random() * 1,
// //               });
// //             chart.data.datasets[1].data.push({
// //                 x: moment(),
// //                 y: Math.random() * 1,
// //             })
// //             chart.data.datasets[2].data.push({
// //               x: moment(),
// //               y: Math.random() * 1,
// //             });
// //           },
// //           delay: 0,
// //           time: {
// //             displayFormat: "h:mm",
// //           },
// //         },
// //         ticks: {
// //           displayFormats: 1,
// //           maxRotation: 0,
// //           minRotation: 0,
// //           stepSize: 1,
// //           maxTicksLimit: 30,
// //           minUnit: "second",
// //           source: "auto",
// //           autoSkip: true,
// //           callback: function (value) {
// //             return moment(value, "HH:mm:ss").format("HH:mm:ss");
// //           },
// //         },
// //       },
// //     ],
// //     yAxes: [
// //       {
// //         ticks: {
// //           beginAtZero: true,
// //           max: 100,
// //           min: -100,
// //         },
// //       },
// //     ],
// //   },
// // };
// //
// // function App() {
// //   return (
// //     <div className="App">
// //       {/*<Line data={data} options={options} />*/}
// //
// //       <Chart type='line' data={chartData} />
// //     </div>
// //   );
// // }
// //
// // export default App;
