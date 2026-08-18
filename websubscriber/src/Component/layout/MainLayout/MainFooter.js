// 메인화면 하단 푸터 컴포넌트
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import './MainLayout.css';
import React, {useMemo, useState} from "react";
import Modal from "../../Modal/Modal";
import '../../Modal/Modal.css';

function MainFooter({vehiclesData}){
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [logging, setLogging] = useState(false);
    const [selectedTopicKeys, setSelectedTopicKeys] = useState([]);
    const [pendingTopics, setPendingTopics] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");

    const vehicleEntries = useMemo(() => (
        Object.entries(vehiclesData || {}).filter(([, vehicleData]) =>
            Object.prototype.hasOwnProperty.call(vehicleData || {}, "topics")
        )
    ), [vehiclesData]);

    const activeVehicleId = vehicleEntries.some(([vehicleId]) => vehicleId === selectedVehicleId)
        ? selectedVehicleId
        : vehicleEntries[0]?.[0] || "";

    const topicEntries = useMemo(() => {
        if (!activeVehicleId) return [];

        return (vehiclesData?.[activeVehicleId]?.topics || []).map((topic) => ({
            key: `${activeVehicleId}::${topic.name}`,
            vehicleId: activeVehicleId,
            name: topic.name,
        }));
    }, [activeVehicleId, vehiclesData]);

    const selectedTopicCount = topicEntries.filter((topic) =>
        selectedTopicKeys.includes(topic.key)
    ).length;

    const handleTopicChange = (topicKey) => {
        setSelectedTopicKeys((current) =>
            current.includes(topicKey)
                ? current.filter((key) => key !== topicKey)
                : [...current, topicKey]
        );
    };

    const handleVehicleChange = (event) => {
        setSelectedVehicleId(event.target.value);
        setSelectedTopicKeys([]);
    };

    const handleStart = () => {
        const selectedTopics = topicEntries.filter((topic) =>
            selectedTopicKeys.includes(topic.key)
        );

        if (selectedTopics.length === 0) return;

        setPendingTopics(selectedTopics);
        setOpen(false);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        setLogging(true);
        setConfirmOpen(false);
    };

    const handleCancelConfirm = () => {
        setConfirmOpen(false);
        setOpen(true);
    };

    return(
        <footer className='footer-bar'>
            <div className='footer-button'>
                <div className='footer-contents'>
                    <p>재생 바 들어길 자리</p>
                    <div className='footer-play'>
                        <IoPlaySkipBackSharp style={{color: 'white'}} />
                        <FaPlay style={{color: 'white', marginLeft: '15px'}}/>
                        <IoPlaySkipForward style={{color: 'white', marginLeft: '15px'}}/>
                    </div>
                </div>
                <button
                    type='button'
                    className='logging-btn'
                    onClick={(e) => {
                        e.stopPropagation();
                        if (logging) {
                            setLogging(false);
                            setPendingTopics([]);
                        }
                        else {
                            setOpen(true);
                        }
                    }}
                >{logging ? "Logging Stop" : "Logging"}
                </button>

                <Modal isOpen={open} onClose={() => setOpen(false)}>
                    <div className='logging-modal-header'>
                        <h3 className='modal-title'>Select Logging Topic</h3>
                        <button
                            type='button'
                            className='modal-btn logging-start-btn'
                            onClick={handleStart}
                            disabled={selectedTopicCount === 0}
                        >Start</button>
                    </div>
                    <div className='logging-vehicle-select-row'>
                        <label htmlFor='logging-vehicle-select'>차량 선택</label>
                        <select
                            id='logging-vehicle-select'
                            className='logging-vehicle-select'
                            value={activeVehicleId}
                            onChange={handleVehicleChange}
                            disabled={vehicleEntries.length === 0}
                        >
                            {vehicleEntries.length > 0 ? vehicleEntries.map(([vehicleId]) => (
                                <option value={vehicleId} key={vehicleId}>{vehicleId}</option>
                            )) : (
                                <option value=''>연결된 차량 없음</option>
                            )}
                        </select>
                    </div>
                    <div className='logging-topic-list' role='group' aria-label='로깅 토픽 목록'>
                        {topicEntries.length > 0 ? topicEntries.map((topic) => {
                            const checked = selectedTopicKeys.includes(topic.key);
                            return (
                                <label className='logging-topic-item' key={topic.key}>
                                    <input
                                        type='checkbox'
                                        checked={checked}
                                        onChange={() => handleTopicChange(topic.key)}
                                    />
                                    <span className={`logging-topic-name ${checked ? 'selected' : ''}`}>
                                        {topic.name}
                                    </span>
                                    <span className='logging-topic-vehicle'>{topic.vehicleId}</span>
                                </label>
                            );
                        }) : (
                            <p className='logging-topic-empty'>현재 출력할 수 있는 토픽이 없습니다.</p>
                        )}
                    </div>
                </Modal>

                <Modal isOpen={confirmOpen} onClose={handleCancelConfirm}>
                    <div className='logging-confirm-modal'>
                        <h3 className='logging-confirm-title'>아래의 토픽을 로깅하시겠습니까?</h3>
                        <div className='logging-confirm-list'>
                            {pendingTopics.map((topic) => (
                                <div className='logging-confirm-topic' key={topic.key}>
                                    <span>{topic.name}</span>
                                    <span>{topic.vehicleId}</span>
                                </div>
                            ))}
                        </div>
                        <div className='logging-confirm-actions'>
                            <button type='button' className='logging-confirm-no' onClick={handleCancelConfirm}>
                                아니요
                            </button>
                            <button type='button' className='logging-confirm-yes' onClick={handleConfirm}>
                                네
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </footer>
    );
}

export default MainFooter;



