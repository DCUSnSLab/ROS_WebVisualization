import React, {useEffect, useState} from "react";
import ROSLIB from "roslib";


let ROSLIB1 = require('roslib');
function Bag_get(){

    const [msg, setMsg] = useState('');

    var ros = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
    })

    useEffect(() => {
        const ROSConnect = () => {
            try {
                ros.on("connection", () => {
                    console.log("Connected to websocket server.");
                    setMsg("Connected to websocket server.");
                    ROSGet(ros);
                });
                ros.on("error", () => {
                    const error = "Error connecting to websocket server.";
                    console.log(error);
                    setMsg(error);
                    alert({ error });
                });
                ros.on("close", () => {
                    console.log("Connection to websocket server closed.");
                    setMsg("Connection to websocket server closed.");
                });
            } catch {
                const error = "Failed to construct websocket. The URL is invalid.";
                setMsg("Failed to construct websocket. The URL is invalid.");
                console.log(error);
                alert({ error });
            }
        };
        ROSConnect();
    }, []);
    const ROSGet = (ros: any) => {
        let listener = new ROSLIB.Topic({
            ros: ros,
            name: "/chatter",
            messageType: "std_msgs/String",
        });

        listener.subscribe((message) => {
            // to do message
            setMsg('Received message on ' + listener.name + ': ' + message.data);
            listener.unsubscribe();

        });
    };

    return(
        <div>
            <p>Check MSG</p>
            <p>{msg}</p>
        </div>
    );
}
export default Bag_get;