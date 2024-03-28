import React, { createContext, useContext, useEffect, useState } from 'react';
import * as ROSLIB from 'roslib';

// createContext
const ROSContext = createContext(null);

export const ROSProvider = ({ children }) => {

    const [ros, setRos] = useState(null);

    useEffect(() => {
        const newRos = new ROSLIB.Ros({
            url: 'ws://203.250.33.143:9090'
        });
        if (newRos && newRos.idCounter) {
          // Safe to use object.idCounter
            newRos.on('connection', () => {
                console.log('Connected to ROS');
            });

            newRos.on('error', (error) => {
                console.log('Error connecting to ROS:', error);
            });

            newRos.on('close', () => {
                console.log('Connection to ROS closed');
            });

            setRos(newRos);

            return () => {
                newRos.close();
            };
        }
    }, []);

    return (
        <ROSContext.Provider value={ros}>
            {children}
        </ROSContext.Provider>
    );
};

export const useROS = () => useContext(ROSContext);