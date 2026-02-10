//추후 CPU, GPU, RAM 데이터 출력 추가 필요

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as ROSLIB from 'roslib';
import { hideInfoBox } from '../../../features/infobox/infoBoxSlice';

function voltageToPercent(v) {
    if (v >= 24.0) return '-';
    return 0;
}

const InfoBox = () => {
    const dispatch = useDispatch();
    const { visible, position, vehicle } = useSelector(
        (state) => state.infoBox
    );

    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [localPos, setLocalPos] = useState({
        x: position.x,
        y: position.y,
    });

    const [speedMs, setSpeedMs] = useState('N/A');
    const [speedKmh, setSpeedKmh] = useState('N/A');
    const [batteryV, setBatteryV] = useState('N/A');
    const [batteryPct, setBatteryPct] = useState('N/A');
    const [controlMode, setControlMode] = useState('N/A');
    const [temperature, setTemperature] = useState('N/A');

    useEffect(() => {
        setLocalPos({
            x: position.x,
            y: position.y,
        });
    }, [position.x, position.y]);

    useEffect(() => {
        if (!visible || !vehicle?.ip) return;

        const ros = new ROSLIB.Ros({
            url: vehicle.ip,
        });

        const hunterStatusListener = new ROSLIB.Topic({
            ros,
            // name: '/hunter_status',
            name: 'vehicle_status_sampled',
            messageType: 'hunter_msgs/HunterStatus',
        });

        hunterStatusListener.subscribe((message) => {
            if (typeof message.linear_velocity === 'number') {
                const v = message.linear_velocity;
                setSpeedMs(v.toFixed(2));
                setSpeedKmh((v * 3.6).toFixed(1));
            }

            if (typeof message.battery_voltage === 'number') {
                const v = message.battery_voltage;
                setBatteryV(v.toFixed(1));
                setBatteryPct(voltageToPercent(v));
            }

            const controlMap = {
                0: 'Manual',
                1: 'ROS',
                2: 'Auto',
                3: 'Remote',
            };
            setControlMode(controlMap[message.control_mode] ?? 'Unknown');

            const states = message.actuator_states;
            if (states && states.length > 0) {
                const maxMotorTemp = Math.max(
                    ...states.map((s) => s.motor_temperature ?? 0)
                );
                const maxDriverTemp = Math.max(
                    ...states.map((s) => s.driver_temperature ?? 0)
                );
                setTemperature(`${maxMotorTemp}°C / ${maxDriverTemp}°C`);
            }
        });

        return () => {
            hunterStatusListener.unsubscribe();
            ros.close();
        };
    }, [visible, vehicle]);

    const onMouseDown = (e) => {
        e.stopPropagation();
        setDragging(true);
        setOffset({
            x: e.clientX - localPos.x,
            y: e.clientY - localPos.y,
        });
    };

    const onMouseMove = (e) => {
        if (!dragging) return;
        setLocalPos({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const onMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging, offset]);

    if (!visible) return null;

    return (
        <div
            id="info-box"
            style={{
                position: 'absolute',
                top: localPos.y,
                left: localPos.x,
                width: '270px',
                backgroundColor: 'white',
                border: '1px solid black',
                borderRadius: '6px',
                zIndex: 1000,
                padding: '12px',
                cursor: dragging ? 'grabbing' : 'default',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(hideInfoBox());
                }}
                style={{
                    position: 'absolute',
                    top: '6px',
                    right: '8px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                ✕
            </button>

            <div
                style={{
                    cursor: 'grab',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    userSelect: 'none',
                }}
                onMouseDown={onMouseDown}
            >
                {vehicle?.name}
            </div>

            <hr />

            <p>
                <strong>Speed:</strong> {speedMs} m/s ({speedKmh} km/h)
            </p>

            <p>
                <strong>Battery:</strong> {batteryV} V ({batteryPct}%)
            </p>

            <p>
                <strong>Control:</strong> {controlMode}
            </p>

            <p>
                <strong>Temperature:</strong> {temperature}
            </p>
        </div>
    );
};

export default InfoBox;