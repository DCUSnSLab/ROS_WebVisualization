import React, {Component, useEffect, useState} from 'react';
import * as ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const Merong = () => {
    const [char, setChat] = useState(null);

    const topic = new ROSLIB.Topic({
        ros : ros,
        name : 'emoticon/gosimperson',
        messageType : 'std_msgs/String'
    })
    function onclick_pub () {
        let imageMessage = new ROSLIB.Message({
            data : "hello"
        });
        topic.publish( imageMessage );
    }

    topic.subscribe((msg) => {
        setChat("hi"+ msg.data);
    })

    return(
        <div>
            <div>{char}</div>
            <textarea>
            </textarea>
            <button onClick={onclick_pub}>
                전송
            </button>
        </div>
    );
}

export default Merong;