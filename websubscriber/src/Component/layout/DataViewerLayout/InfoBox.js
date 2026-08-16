import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideInfoBox } from '../../../features/infobox/infoBoxSlice';

function voltageToPercent(voltage) {
    if (voltage >= 24.0) return '-';
    return 0;
}

function formatNumber(value, digits = 1) {
    return typeof value === 'number' ? value.toFixed(digits) : 'N/A';
}

export default function InfoBox({ vehiclesData = {}, onResetPath }) {
    const dispatch = useDispatch();
    const { visible, position, vehicle } = useSelector((state) => state.infoBox);

    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [localPos, setLocalPos] = useState({ x: position.x, y: position.y });

    const vehicleData = vehicle?.id ? vehiclesData?.[vehicle.id] : null;
    const hunterStatus = useMemo(
        () =>
            vehicleData?.topicsData?.['/hunter_status'] ||
            vehicleData?.topicsData?.['vehicle_status_sampled'] ||
            null,
        [vehicleData]
    );

    const speedMs = useMemo(() => {
        if (typeof hunterStatus?.linear_velocity === 'number') {
            return hunterStatus.linear_velocity.toFixed(2);
        }
        return 'N/A';
    }, [hunterStatus]);

    const speedKmh = useMemo(() => {
        if (typeof hunterStatus?.linear_velocity === 'number') {
            return (hunterStatus.linear_velocity * 3.6).toFixed(1);
        }
        return 'N/A';
    }, [hunterStatus]);

    const batteryV = useMemo(
        () => formatNumber(hunterStatus?.battery_voltage, 1),
        [hunterStatus]
    );

    const batteryPct = useMemo(() => {
        if (typeof hunterStatus?.battery_voltage === 'number') {
            return voltageToPercent(hunterStatus.battery_voltage);
        }
        return 'N/A';
    }, [hunterStatus]);

    const controlMode = useMemo(() => {
        const controlMap = {
            0: 'Manual',
            1: 'ROS',
            2: 'Auto',
            3: 'Remote',
        };
        return controlMap[hunterStatus?.control_mode] ?? 'N/A';
    }, [hunterStatus]);

    const temperature = useMemo(() => {
        const states = hunterStatus?.actuator_states;
        if (!Array.isArray(states) || states.length === 0) {
            return 'N/A';
        }

        const maxMotorTemp = Math.max(
            ...states.map((state) => state.motor_temperature ?? 0)
        );
        const maxDriverTemp = Math.max(
            ...states.map((state) => state.driver_temperature ?? 0)
        );
        return `${maxMotorTemp}C / ${maxDriverTemp}C`;
    }, [hunterStatus]);

    // bag 여부는 소스가 register 때 보낸 명시적 플래그(is_bag)로 판단
    const isBag = Boolean(vehicleData?.isBag);

    useEffect(() => {
        setLocalPos({ x: position.x, y: position.y });
    }, [position.x, position.y]);

    useEffect(() => {
        if (dragging) {
            const onMouseMove = (event) => {
                setLocalPos({
                    x: event.clientX - offset.x,
                    y: event.clientY - offset.y,
                });
            };

            const onMouseUp = () => {
                setDragging(false);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            return () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        }

        return undefined;
    }, [dragging, offset.x, offset.y]);

    const onMouseDown = (event) => {
        event.stopPropagation();
        setDragging(true);
        setOffset({
            x: event.clientX - localPos.x,
            y: event.clientY - localPos.y,
        });
    };

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
            onClick={(event) => event.stopPropagation()}
        >
            <button
                onClick={(event) => {
                    event.stopPropagation();
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
                X
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
                {vehicle?.name || vehicle?.id || 'Unknown Vehicle'}
            </div>

            <hr />

            <p>
                <strong>Speed:</strong> {speedMs} m/s ({speedKmh} km/h)
            </p>

            <p>
                <strong>Battery:</strong> {batteryV} V ({batteryPct}%)
            </p>

            <div>
                <strong>Control:</strong> {controlMode}{' '}
                {isBag && (
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
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '4px',
                                left: controlMode === 'Remote' ? '75px' : '4px',
                                width: '70px',
                                height: 'calc(100% - 8px)',
                                backgroundColor: 'white',
                                borderRadius: '30px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                transition: '0.25s',
                            }}
                        />

                        <div
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                zIndex: 1,
                                color:
                                    controlMode === 'Remote' ? '#888' : '#111',
                            }}
                        >
                            Auto
                        </div>

                        <div
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                zIndex: 1,
                                color:
                                    controlMode === 'Remote' ? '#111' : '#888',
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

            <div
                onClick={(event) => {
                    event.stopPropagation();
                    if (onResetPath) onResetPath(vehicle?.id);
                }}
                style={{
                    marginTop: '8px',
                    padding: '3px 8px',
                    textAlign: 'center',
                    background: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    userSelect: 'none',
                }}
            >
                이동 경로 초기화
            </div>
        </div>
    );
}
