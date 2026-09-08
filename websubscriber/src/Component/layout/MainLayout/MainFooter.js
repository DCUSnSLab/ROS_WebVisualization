// 메인화면 하단 푸터 컴포넌트
import { FaPlay, FaPause } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import './MainLayout.css';
import React, {useMemo, useState} from "react";
import Modal from "../../Modal/Modal";
import '../../Modal/Modal.css';

// 초 → mm:ss
const formatPlaybackTime = (totalSeconds) => {
    const safe = Number.isFinite(totalSeconds) ? Math.max(0, totalSeconds) : 0;
    const m = Math.floor(safe / 60);
    const s = Math.floor(safe % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const createCurrentTimeBagName = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
        `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

function MainFooter({vehiclesData, onLoggingChange}){
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loggingSession, setLoggingSession] = useState(null);
    const [lastBagPath, setLastBagPath] = useState("");
    const logging = loggingSession !== null;
    const [loggingPending, setLoggingPending] = useState(false);
    const [loggingError, setLoggingError] = useState("");
    const [selectedTopicKeys, setSelectedTopicKeys] = useState([]);
    const [pendingTopics, setPendingTopics] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [topicSearch, setTopicSearch] = useState("");
    const [bagName, setBagName] = useState("");
    const [logAllTopics, setLogAllTopics] = useState(false);

    // bag 재생 바 (UI 전용, 동작은 추후 연결)
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSeek, setPlaybackSeek] = useState(0); // 0~100 (%)
    const playbackDurationSec = 0; // TODO: 실제 bag 길이 연결
    const playbackCurrentSec = (playbackSeek / 100) * playbackDurationSec;

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

    const handleConfirm = async () => {
        const vehicleId = pendingTopics[0]?.vehicleId;
        if (!vehicleId || loggingPending) return;
        const resolvedBagName = bagName.trim() ? bagName : createCurrentTimeBagName();

        setLoggingPending(true);
        setLoggingError("");
        try {
            if (typeof onLoggingChange !== "function") {
                throw new Error("Logging handler is not configured");
            }

            const topicNames = pendingTopics.map((topic) => topic.name);
            const result = await onLoggingChange({
                vehicleId,
                isLogging: true,
                bagName: resolvedBagName,
                topics: topicNames,
            });
            if (result?.is_logging !== true) {
                throw new Error(result?.message || "The vehicle did not enter logging state");
            }

            const activeSession = {
                vehicleId,
                bagName: resolvedBagName,
                bagPath: result.bag_path || "",
                topics: topicNames,
            };
            setLoggingSession(activeSession);
            setLastBagPath(activeSession.bagPath);
            setConfirmOpen(false);
            setPendingTopics([]);
            setSelectedTopicKeys([]);
            setTopicSearch("");
            setLogAllTopics(false);
            setBagName("");
        } catch (error) {
            setLoggingError(error?.message || "Logging request failed");
        } finally {
            setLoggingPending(false);
        }
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
                    <div className='playback-bar'>
                        <div className='playback-track-row'>
                            <span className='playback-time'>{formatPlaybackTime(playbackCurrentSec)}</span>
                            <input
                                type='range'
                                className='playback-seek'
                                min={0}
                                max={100}
                                step={0.1}
                                value={playbackSeek}
                                onChange={(e) => setPlaybackSeek(Number(e.target.value))}
                                aria-label='재생 위치'
                                style={{
                                    background: `linear-gradient(to right, #ffffff ${playbackSeek}%, rgba(255,255,255,0.25) ${playbackSeek}%)`,
                                }}
                            />
                            <span className='playback-time'>{formatPlaybackTime(playbackDurationSec)}</span>
                        </div>
                        <div className='playback-controls'>
                            <button
                                type='button'
                                className='playback-btn'
                                aria-label='이전'
                            >
                                <IoPlaySkipBackSharp />
                            </button>
                            <button
                                type='button'
                                className='playback-btn playback-play'
                                onClick={() => setIsPlaying((v) => !v)}
                                aria-label={isPlaying ? '일시정지' : '재생'}
                            >
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <button
                                type='button'
                                className='playback-btn'
                                aria-label='다음'
                            >
                                <IoPlaySkipForward />
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    type='button'
                    className='logging-btn'
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (logging) {
                            const vehicleId = loggingSession?.vehicleId;
                            if (!vehicleId || loggingPending) return;

                            setLoggingPending(true);
                            setLoggingError("");
                            try {
                                if (typeof onLoggingChange !== "function") {
                                    throw new Error("Logging handler is not configured");
                                }
                                const result = await onLoggingChange({vehicleId, isLogging: false});
                                if (result?.is_logging === true) {
                                    throw new Error(result?.message || "The vehicle is still logging");
                                }
                                setLastBagPath(result?.bag_path || loggingSession?.bagPath || "");
                                setLoggingSession(null);
                                setPendingTopics([]);
                            } catch (error) {
                                setLoggingError(error?.message || "Logging request failed");
                            } finally {
                                setLoggingPending(false);
                            }
                        }
                        else {
                            setOpen(true);
                        }
                    }}
                    disabled={loggingPending}
                >{loggingPending ? "Processing..." : logging ? "Logging Stop" : "Logging"}
                </button>
                {!loggingError && (loggingSession?.bagPath || lastBagPath) && (
                    <span className='logging-bag-path' role='status'>
                        {logging ? "저장 중" : "저장 완료"}: {loggingSession?.bagPath || lastBagPath}
                    </span>
                )}
                {loggingError && (
                    <span className='logging-footer-error' role="alert">{loggingError}</span>
                )}

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
                        {loggingError && (
                            <div className='logging-confirm-error' role='alert'>
                                {loggingError}
                            </div>
                        )}
                        <div className='logging-confirm-actions'>
                            <button
                                type='button'
                                className='logging-confirm-no'
                                onClick={handleCancelConfirm}
                                disabled={loggingPending}
                            >
                                아니요
                            </button>
                            <button
                                type='button'
                                className='logging-confirm-yes'
                                onClick={handleConfirm}
                                disabled={loggingPending}
                            >
                                {loggingPending ? "처리 중..." : "네"}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </footer>
    );
}

export default MainFooter;

