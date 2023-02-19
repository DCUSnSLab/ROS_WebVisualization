import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const TfClient = new ROSLIB.TFClient({
    ros: ros,
    fixedFrame : 'map'
})

const PoseXYZ = () => {
    const [odomTF, setdodmTF] = useState('');
    const [baseTF, setbaseTF] = useState('');

    useEffect(() => {
        TfClient.subscribe('odom', (msg) => {
            setdodmTF(msg.translation.x + ", " + msg.translation.y + ", " + msg.translation.z);
        })
        TfClient.subscribe('base_link', (msg) => {
            setbaseTF(msg.translation.x + ", " + msg.translation.y + ", " + msg.translation.z);
        })
    })

    return(
        <div>
            <div>
                <h1>map</h1>
            </div>
            <div>
                <h1>odom</h1>
                <h3>{odomTF}</h3>
            </div>
            <div>
                <h1>base_link</h1>
                <h3>{baseTF}</h3>
            </div>
        </div>
    );
}
export default PoseXYZ;