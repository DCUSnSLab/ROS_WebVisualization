import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as ROSLIB from 'roslib';

const InfoBox = () => {
    const { visible, position, vehicle } = useSelector((state) => state.infoBox);
    const topicsByVehicle = useSelector((state) => state.TopicList?.topicsByVehicle);
    const [rpm, setRpm] = useState(null);

    useEffect(() => {
        if (!visible || !vehicle) {
            return;
        }

        setRpm('Loading...');

        if (!topicsByVehicle) {
            setRpm('None');
            return;
        }

        const vehicleTopics = topicsByVehicle[vehicle.ip];
        const hasHunterStatus = vehicleTopics?.topic.includes('/hunter_status');

        if (!hasHunterStatus) {
            setRpm('None');
            return;
        }

        const ros = new ROSLIB.Ros({
            url: `ws://${vehicle.ip}:9090`,
        });

        ros.on('connection', () => {
            console.log('Connected to ROS for RPM.');
        });

        ros.on('error', (error) => {
            console.log('Error connecting to ROS for RPM:', error);
            setRpm('Error');
        });

        ros.on('close', () => {
            console.log('Connection to ROS for RPM closed.');
        });

        const rpmListener = new ROSLIB.Topic({
            ros: ros,
            name: '/hunter_status',
            messageType: 'std_msgs/String', // Assumption: change if incorrect
        });

        rpmListener.subscribe((message) => {
            // Assuming the message is a string that can be parsed to a number.
            // If the message is a different type, this needs to be changed.
            setRpm(message.data);
        });

        return () => {
            rpmListener.unsubscribe();
            ros.close();
        };
    }, [visible, vehicle, topicsByVehicle]);

    if (!visible) {
        return null;
    }

    return (
        <div
            id="info-box"
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: '200px',
                height: '180px',
                backgroundColor: 'white',
                border: '1px solid black',
                zIndex: 1000,
                padding: '10px',
            }}
        >
            {vehicle && (
                <div>
                    <h3>{vehicle.name}</h3>
                    <p>Lat: {vehicle.lat}</p>
                    <p>Lng: {vehicle.lng}</p>
                    <p>RPM: {rpm}</p>
                </div>
            )}
        </div>
    );
};

export default InfoBox;