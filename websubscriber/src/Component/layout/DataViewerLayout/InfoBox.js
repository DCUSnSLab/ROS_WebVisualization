//추후 CPU, GPU, RAM 데이터 출력 추가 필요

import React, { useEffect, useState, useRef } from 'react';
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
    const [temperature, setTemperature] = useState('N/A');

    const [controlMode, setControlMode] = useState('N/A'); //현재 상태 출력
    const [controlTab, setControlTab] = useState('auto'); //control 토글

    const [isRealVehicle, setIsRealVehicle] = useState(false); //bag, vehicle 구분용
    const heartbeatTimeoutRef = useRef(null);

    const rosRef = useRef(null);

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

        rosRef.current = ros;

        const hunterStatusListener = new ROSLIB.Topic({
            ros,
            // name: '/hunter_status', //기존 토픽
            name: 'vehicle_status_sampled', //샘플링한 토픽
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
                0: 'Manual', //직접 조종
                1: 'ROS', //ROS 노드
                2: 'Auto', //알고리즘
                3: 'Remote', //무선 조종기
            };

            const mode = controlMap[message.control_mode] ?? 'Unknown';

            setControlMode(mode);

            if (isRealVehicle) {
                if (mode === 'Remote' || mode === 'Manual') {
                    setControlTab('remote');
                } else {
                    setControlTab('auto');
                }
            }

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

        //이동체 연결 구분
        ros.on('connection', () => {
            ros.getTopics((topics) => {
                if (topics.topics.includes('/final_cmd')) {
                    console.log('/final_cmd 토픽 있음');
                    setIsRealVehicle(true);
                } else {
                    console.log('/final_cmd 토픽 없음');
                    setIsRealVehicle(false);
                }
            });
        });

        return () => {
            hunterStatusListener.unsubscribe();

            if (heartbeatTimeoutRef.current) {
                clearTimeout(heartbeatTimeoutRef.current);
            }

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

    useEffect(() => {
        if (!isRealVehicle) {
            setControlTab('auto');
        }
    }, [isRealVehicle]);

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

            <div>
                <strong>Control:</strong> {' '}
                {controlMode}
                {!isRealVehicle && (
                    <span style={{ color: 'orange', marginLeft: '1px', fontWeight: 'bold' }}>
                            (bag)
                        </span>
                )}
                <div>
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            width: '150px',
                            backgroundColor: '#e5e5e5',
                            borderRadius: '30px',
                            padding: '4px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '4px',
                                left: controlTab === 'auto' ? '4px' : '75px',
                                width: '70px',
                                height: 'calc(100% - 8px)',
                                backgroundColor: 'white',
                                borderRadius: '30px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                transition: '0.25s',
                            }}
                        />

                        <div
                            onClick={() => {
                                if (controlTab === 'auto') return;
                                if (!isRealVehicle) return;
                                setControlTab('auto');
                            }}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                zIndex: 1,
                                color: controlTab === 'auto' ? '#111' : '#888',
                            }}
                        >
                            Auto
                        </div>

                        <div
                            onClick={() => {
                                if (controlTab === 'remote') return;
                                if (isRealVehicle) {
                                    if (controlMode !== 'Auto') {
                                        alert("현재 Auto 상태가 아닙니다.");
                                        return;
                                    }
                                } else return;

                                alert('remote 모드로 전환합니다.');

                                if (!rosRef.current) {
                                    alert('연결 실패');
                                    return;
                                }

                                const service = new ROSLIB.Service({
                                    ros: rosRef.current,
                                    name: '/monitoring/request_control',
                                    serviceType: 'control_msgs/srv/RequestControl',
                                });

                                const request = new ROSLIB.ServiceRequest({
                                    requester_id: 'web',
                                    requested_mode: 3,
                                });

                                service.callService(
                                    request,
                                    function (result) {
                                        if (result.success) {
                                            console.log('이동체 제어 연결 성공');
                                        } else {
                                            alert('이동체 연결에 실패하였습니다.\n' + result.message);
                                        }
                                    },
                                    function (error) {
                                        console.error("Service 호출 에러:", error);
                                        alert("Service 호출 자체가 실패했습니다.");
                                    }
                                );
                            }}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                zIndex: 1,
                                color: controlTab === 'remote' ? '#111' : '#888',
                            }}
                        >
                            Remote
                        </div>
                    </div>
                </div>
            </div>

            <p>
                <strong>Temperature:</strong> {temperature}
            </p>
        </div>
    );
};

export default InfoBox;