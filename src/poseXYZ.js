import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const PoseXYZ = () => {
    const [mapTF, setmapTF] = useState('');
    const [odomTF, setdodmTF] = useState('');
    const [baseTF, setbaseTF] = useState('');

    useEffect(() => {

        const TfClient = new ROSLIB.Topic({
            ros: ros,
            name: "/tf",
            messageType: "tf2_msgs/TFMessage"
        })

        TfClient.subscribe((msg) => {
            // console.log(msg.position.x);
            setmapTF(msg.position.x + ', ' + msg.position.y + ', ' + msg.position.z);
            // setbaseTF(msg.pose.pose.position.x + ', ' + msg.pose.pose.position.y + ', ' + msg.pose.pose.position.z);
        })
    })

    return(
        <div>
            <div>
                <h1>map</h1>
                <h2>{mapTF}</h2>
            </div>
            <div>
                <h1>odom</h1>
                <h2>{odomTF}</h2>
            </div>
            <div>
                <h1>base_link</h1>
                <h2>{baseTF}</h2>
            </div>
        </div>
    );
}
export default PoseXYZ;