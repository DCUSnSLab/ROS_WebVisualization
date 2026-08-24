// 메인화면 하단 푸터 컴포넌트
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import './MainLayout.css';
import React, {useMemo, useState} from "react";
import Modal from "../../Modal/Modal";
import '../../Modal/Modal.css';

const createCurrentTimeBagName = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
        `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

function MainFooter({vehiclesData, onLoggingChange}){
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [logging, setLogging] = useState(false);
    const [selectedTopicKeys, setSelectedTopicKeys] = useState([]);
    const [pendingTopics, setPendingTopics] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [topicSearch, setTopicSearch] = useState("");
    const [bagName, setBagName] = useState("");
    const [logAllTopics, setLogAllTopics] = useState(false);

    const vehicleEntries = useMemo(() => (
        Object.entries(vehiclesData || {}).filter(([, vehicleData]) =>
            Object.prototype.hasOwnProperty.call(vehicleData || {}, "topics") &&
            !vehicleData?.isBag
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

    const filteredTopicEntries = useMemo(() => {
        const keyword = topicSearch.trim().toLocaleLowerCase();
        if (!keyword) return topicEntries;

        return topicEntries.filter((topic) =>
            topic.name.toLocaleLowerCase().includes(keyword)
        );
    }, [topicEntries, topicSearch]);

    const selectedTopicCount = topicEntries.filter((topic) =>
        selectedTopicKeys.includes(topic.key)
    ).length;
    const topicsToLogCount = logAllTopics ? topicEntries.length : selectedTopicCount;

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
        setTopicSearch("");
        setLogAllTopics(false);
    };

    const handleStart = () => {
        const selectedTopics = logAllTopics
            ? topicEntries
            : topicEntries.filter((topic) => selectedTopicKeys.includes(topic.key));

        if (selectedTopics.length === 0) return;

        setPendingTopics(selectedTopics);
        setBagName("");
        setOpen(false);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        const vehicleId = pendingTopics[0]?.vehicleId;
        if (!vehicleId) return;
        const resolvedBagName = bagName.trim() ? bagName : createCurrentTimeBagName();

        setLogging(true);
        setConfirmOpen(false);
        setSelectedTopicKeys([]);
        setTopicSearch("");
        setLogAllTopics(false);
        setBagName("");
        onLoggingChange?.({
            vehicleId,
            isLogging: true,
            bagName: resolvedBagName,
            topics: pendingTopics.map((topic) => topic.name),
        });
    };

    const handleCancelConfirm = () => {
        setConfirmOpen(false);
        setOpen(true);
    };

    const handleCloseLoggingModal = () => {
        setOpen(false);
        setSelectedTopicKeys([]);
        setTopicSearch("");
        setLogAllTopics(false);
        setBagName("");
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
                            const vehicleId = pendingTopics[0]?.vehicleId;
                            setLogging(false);
                            setPendingTopics([]);
                            if (vehicleId) {
                                onLoggingChange?.({vehicleId, isLogging: false});
                            }
                        }
                        else {
                            setOpen(true);
                        }
                    }}
                >{logging ? "Logging Stop" : "Logging"}
                </button>

                <Modal isOpen={open} onClose={handleCloseLoggingModal}>
                    <div className='logging-modal-header'>
                        <h3 className='modal-title'>Select Logging Topic</h3>
                        <button
                            type='button'
                            className='modal-btn logging-start-btn'
                            onClick={handleStart}
                            disabled={topicsToLogCount === 0}
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
                        <label htmlFor='logging-topic-search'>토픽 검색</label>
                        <input
                            id='logging-topic-search'
                            className='logging-topic-search'
                            type='search'
                            value={topicSearch}
                            onChange={(event) => setTopicSearch(event.target.value)}
                            placeholder='토픽 이름 검색'
                            disabled={!activeVehicleId}
                        />
                    </div>
                    <div className='logging-topic-mode-row'>
                        <label className='logging-all-topics-option'>
                            <input
                                type='checkbox'
                                checked={logAllTopics}
                                onChange={(event) => setLogAllTopics(event.target.checked)}
                                disabled={topicEntries.length === 0}
                            />
                            <span>전체 토픽 로깅</span>
                            <span className='logging-all-topics-count'>({topicEntries.length}개)</span>
                        </label>
                        {!logAllTopics && (
                            <span className='logging-custom-topics-count'>
                                {selectedTopicCount}개 선택
                            </span>
                        )}
                    </div>
                    <div className='logging-topic-list' role='group' aria-label='로깅 토픽 목록'>
                        {filteredTopicEntries.length > 0 ? filteredTopicEntries.map((topic) => {
                            const checked = logAllTopics || selectedTopicKeys.includes(topic.key);
                            return (
                                <label className={`logging-topic-item ${logAllTopics ? 'all-selected' : ''}`} key={topic.key}>
                                    <input
                                        type='checkbox'
                                        checked={checked}
                                        onChange={() => handleTopicChange(topic.key)}
                                        disabled={logAllTopics}
                                    />
                                    <span className={`logging-topic-name ${checked ? 'selected' : ''}`}>
                                        {topic.name}
                                    </span>
                                    <span className='logging-topic-vehicle'>{topic.vehicleId}</span>
                                </label>
                            );
                        }) : (
                            <p className='logging-topic-empty'>
                                {topicEntries.length > 0
                                    ? '검색 결과가 없습니다.'
                                    : '현재 출력할 수 있는 토픽이 없습니다.'}
                            </p>
                        )}
                    </div>
                </Modal>

                <Modal isOpen={confirmOpen} onClose={handleCancelConfirm}>
                    <div className='logging-confirm-modal'>
                        <h3 className='logging-confirm-title'>아래의 토픽을 로깅하시겠습니까?</h3>
                        <div className='logging-bag-name-row'>
                            <label className='logging-bag-name-label' htmlFor='logging-bag-name'>
                                Bag 데이터 이름
                            </label>
                            <input
                                id='logging-bag-name'
                                className='logging-bag-name-input'
                                type='text'
                                value={bagName}
                                onChange={(event) => setBagName(event.target.value)}
                                placeholder='미입력 시 현재 시간으로 저장됩니다'
                                maxLength={100}
                                autoFocus
                            />
                        </div>
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
                            <button
                                type='button'
                                className='logging-confirm-yes'
                                onClick={handleConfirm}
                            >
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

