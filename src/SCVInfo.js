import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const htClient = new ROSLIB.Topic({
    ros : ros,
    name : '/hunter_status',
    messageType : 'hunter_msgs/HunterStatus'
})

const SCVInfo = () => {
    const [odomTF, setdodmTF] = useState('');
    const [baseTF, setbaseTF] = useState('');
    const [ht, setHt] = useState('');

    //hunter_status : 차량 정보

    useEffect(() => {
        htClient.subscribe((msg) => {
            console.log(msg)
        })
    })

    return(
        <div>
            <div>{ht}</div>
        </div>
    );
}
export default SCVInfo;