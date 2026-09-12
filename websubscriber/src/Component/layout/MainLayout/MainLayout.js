// MainLayout.js
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import "./MainLayout.css";
import Header from "./MainHeader";
import Footer from "./MainFooter";
import SidebarTop from "./SidebarTop";
import DataSpace from "../DataViewerLayout/DataSpace";
import InfoBox from "../DataViewerLayout/InfoBox";
import UseRosVehicles from "./UseRosVehicles";
import { hideInfoBox } from "../../../features/infobox/infoBoxSlice";

const MainLayout = ({ name, dropdownContent, content }) => {
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState("real");
    const [isOpenVehicle, setIsOpenVehicle] = useState(true);
    const [vehicles, setVehicles] = useState([]);

    // const { vehiclesData, vehicleList } = UseRosVehicles(vehicles);
    const {
        vehiclesData,
        vehicleList,
        vehicleStatuses,
        bagPlayback,
        requestTopicList,
        requestLogging,
        requestBagList,
        requestBagPlayback,
        subscribeTopic,
        unsubscribeTopic,
        switchDataMode,
        resetPath,
        clearVehicleTrack,
        disconnectVehicle
    } = UseRosVehicles();

    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedPanel, setSelectedPanel] = useState("");

    // 차량 추가/삭제 (기존대로)
    const addVehicle = (rawIP, vehicleName) => {
        if (!rawIP || !vehicleName) return;
        const vehicleIP = `ws://${rawIP}`;
        setVehicles((prev) => (prev.some((v) => v.ip === vehicleIP) ? prev : [...prev, { ip: vehicleIP, name: vehicleName }]));
    };
    const removeVehicle = (ip) => setVehicles((prev) => prev.filter((v) => v.ip !== ip));

    const [realVisuals, setRealVisuals] = useState([]);
    const [bagVisuals, setBagVisuals] = useState([]);
    const visuals = viewMode === "bag" ? bagVisuals : realVisuals;
    const setVisuals = viewMode === "bag" ? setBagVisuals : setRealVisuals;
    const [loggingByVehicle, setLoggingByVehicle] = useState({});
    const [sidebarTopicSearch, setSidebarTopicSearch] = useState("");
    const [bagConnecting, setBagConnecting] = useState(false); // bag 연결중(조작 잠금)
    const [bagWasPlaying, setBagWasPlaying] = useState(false);  // real로 나갈 때 재생 중이었는지
    const realConnectedRef = useRef(new Set());                 // real에서 Connect한 이동체 id
    // 사이드바 새로고침으로 bag 변경: null | { vehicleId, phase:"confirm"|"list", files, loading, error }
    const [bagChange, setBagChange] = useState(null);

    const visibleVehiclesData = useMemo(() => {
        if (viewMode === "real") return vehiclesData;
        if (!bagPlayback.vehicleId) return {};

        const selectedVehicle = vehiclesData?.[bagPlayback.vehicleId];
        if (!selectedVehicle) return {};

        return {
            [bagPlayback.vehicleId]: {
                ...selectedVehicle,
                isBag: true,
                name: bagPlayback.bagName || selectedVehicle.name || bagPlayback.vehicleId,
            },
        };
    }, [bagPlayback.bagName, bagPlayback.vehicleId, vehiclesData, viewMode]);

    const handleViewModeChange = (nextMode) => {
        if (nextMode === viewMode) return;

        setSidebarTopicSearch("");

        if (nextMode === "bag") {
            // bag 전환: real 데이터 전송 중단(복귀 시 재연결 위해 스냅샷 보관).
            // 이전에 '재생 중'이었을 때만 재개하고, 사용자가 멈춰둔 경우엔 멈춘 상태를 유지한다.
            switchDataMode("bag");
            if (bagPlayback.vehicleId && bagWasPlaying) {
                requestBagPlayback({
                    vehicleId: bagPlayback.vehicleId,
                    action: "play",
                }).catch((error) => {
                    console.warn("Failed to resume bag playback while entering bag mode", error);
                });
            }
        } else {
            // real 전환: 재생 중이면 일시정지(위치 보존)하고 '재생 중이었음'을 기억 → real 데이터 재연결.
            const wasPlaying = bagPlayback.state === "playing";
            setBagWasPlaying(wasPlaying);
            if (bagPlayback.vehicleId && wasPlaying) {
                requestBagPlayback({
                    vehicleId: bagPlayback.vehicleId,
                    action: "pause",
                }).catch((error) => {
                    console.warn("Failed to pause bag playback while returning to real mode", error);
                });
            }
            switchDataMode("real");
        }

        setViewMode(nextMode);
    };

    // 재생 제어 래퍼: seek/stop 시 이동 경로(및 마커)를 초기화한다.
    //  - seek: 사용자가 시간대를 옮기면 이전 위치에서 이어지는 궤적선이 남지 않도록 경로 리셋
    //  - stop: 경로 + 마커 완전 제거
    const handlePlaybackControl = async (params) => {
        const vehicleId = params?.vehicleId || bagPlayback.vehicleId;
        if (params?.action === "seek") {
            // 즉시 리셋 + respawn(~1초) 동안 흘러들어오는 이전 위치 GPS까지 한 번 더 지움
            resetPath(vehicleId);
            setTimeout(() => resetPath(vehicleId), 1300);
        } else if (params?.action === "stop") {
            clearVehicleTrack(vehicleId); // 경로 + 마커 제거
        }
        return requestBagPlayback(params);
    };

    const handleOpenBag = async ({ vehicleId, bagPath }) => {
        // 이전 bag과 관련된 모든 연결 종료(구독 해제 + 시각화 제거 + 차량 정보 모달 닫기 + 경로/마커 제거)
        dispatch(hideInfoBox());
        for (const v of bagVisuals) {
            unsubscribeTopic(v.ip, v.topic, { force: true });
        }
        setBagVisuals([]);
        clearVehicleTrack(vehicleId);
        // 연결중: 이 동안 재생 컨트롤을 잠근다(연결이 끝나면 일시정지 상태로 대기)
        setBagConnecting(true);
        try {
            const result = await requestBagPlayback({
                vehicleId,
                action: "open",
                bagPath,
            });
            requestTopicList(vehicleId);
            return result;
        } finally {
            setBagConnecting(false);
        }
    };

    // 사이드바 새로고침 버튼: "다른 bag으로 변경?" 확인 → bag 목록 → 선택 → 재연결
    const handleRefreshBag = (vehicleId) => {
        setBagChange({ vehicleId, phase: "confirm", files: [], loading: false, error: "" });
    };

    // real에서 이동체 연결(Connect): 어떤 이동체를 real로 연결했는지 기록해둔다.
    const handleRealConnect = (vehicleId) => {
        if (vehicleId) realConnectedRef.current.add(vehicleId);
        requestTopicList(vehicleId);
    };

    // bag 사이드바의 X:
    //  - real에서도 연결된 이동체면 → bag 재생만 종료(이동체 연결 유지)
    //  - bag에서만 연결된 이동체면 → 이동체 연결까지 종료
    const handleCloseBag = (vehicleId) => {
        const vid = vehicleId || bagPlayback.vehicleId;
        if (vid) {
            requestBagPlayback({ vehicleId: vid, action: "stop" }).catch((error) => {
                console.warn("Failed to stop bag playback on close", error);
            });
            clearVehicleTrack(vid);
        }
        setBagVisuals([]);
        setBagWasPlaying(false);
        dispatch(hideInfoBox());

        // real 연결이 없던(오직 bag) 이동체면 연결까지 종료
        if (vid && !realConnectedRef.current.has(vid)) {
            disconnectVehicle(vid);
            setRealVisuals((prev) => prev.filter((v) => v.ip !== vid));
        }
    };

    const loadBagChangeList = async () => {
        const vehicleId = bagChange?.vehicleId;
        if (!vehicleId) return;
        setBagChange((c) => (c ? { ...c, phase: "list", loading: true, error: "" } : c));
        try {
            const files = await requestBagList(vehicleId);
            setBagChange((c) =>
                c ? { ...c, files: Array.isArray(files) ? files : [], loading: false } : c
            );
        } catch (error) {
            setBagChange((c) =>
                c ? { ...c, loading: false, error: error?.message || "Bag 목록을 불러오지 못했습니다." } : c
            );
        }
    };

    const selectBagForChange = async (bagPath) => {
        const vehicleId = bagChange?.vehicleId;
        if (!vehicleId || !bagPath) return;
        // real 모드였다면 bag 모드로 전환(라이브 중단)
        if (viewMode !== "bag") handleViewModeChange("bag");
        try {
            await handleOpenBag({ vehicleId, bagPath });
        } catch (error) {
            setBagChange((c) => (c ? { ...c, error: error?.message || "Bag 실행 실패" } : c));
            return;
        }
        setBagChange(null);
    };

    const handleLoggingChange = async ({ vehicleId, isLogging, bagName, topics }) => {
        const result = await requestLogging({
            vehicleId,
            isLogging,
            bagName: bagName || "",
            topics: topics || [],
        });

        const actualLogging = result?.is_logging === true;
        if (isLogging !== actualLogging) {
            throw new Error(
                result?.message ||
                (isLogging
                    ? "The vehicle did not start logging"
                    : "The vehicle did not stop logging")
            );
        }

        setLoggingByVehicle((current) => {
            const next = { ...current };
            if (actualLogging) {
                next[vehicleId] = {
                    isLogging: true,
                    bagName,
                    bagPath: result.bag_path || "",
                };
            } else {
                delete next[vehicleId];
            }
            return next;
        });

        console.log("logging result:", {
            vehicleId,
            status: result.logging_status,
            isLogging: actualLogging,
            bagPath: result.bag_path,
        });
        return result;
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic((prev) => (prev === topic ? null : topic));
        setSelectedPanel("");
    };

    const activePanelsByTopic = useMemo(() => {
        const map = {};
        for (const v of visuals) {
            const topicKey = `${v.ip}::${v.topic}`;
            if (!map[topicKey]) map[topicKey] = new Set();
            map[topicKey].add(v.panel);
        }
        return map;
    }, [visuals]);

    // const handlePanelSelect = ({ topic, panel }) => {
    //     // 토픽이 바뀌면 해당 토픽을 기준으로
    //     setSelectedTopic(topic || null);
    //     setSelectedPanel(panel || "");
    // };

    const handlePanelSelect = ({ topic, panel, ip }) => {
        setVisuals((prev) => {
            const vizId = `${ip}-${topic}-${panel}`;
            const isAlreadyOn = prev.some((x) => x.id === vizId);

            if (isAlreadyOn) {
                const remainingForTopic = prev.filter(
                    (x) => x.id !== vizId && x.ip === ip && x.topic === topic
                );
                if (remainingForTopic.length === 0) {
                    unsubscribeTopic(ip, topic);
                }
                return prev.filter((x) => x.id !== vizId);
            }

            if (!panel) {
                return prev;
            }

            return [...prev, { id: vizId, topic, panel, ip }];
        });
    };

    // 이동체 연결 종료 확인 모달
    const [disconnectTarget, setDisconnectTarget] = useState(null);

    const handleDisconnectVehicle = (vehicleId) => {
        setDisconnectTarget(vehicleId); // 모달 열기
    };

    const confirmDisconnect = () => {
        if (!disconnectTarget) return;
        realConnectedRef.current.delete(disconnectTarget);
        disconnectVehicle(disconnectTarget);
        setRealVisuals((prev) => prev.filter((v) => v.ip !== disconnectTarget));
        setBagVisuals((prev) => prev.filter((v) => v.ip !== disconnectTarget));
        setLoggingByVehicle((current) => {
            const next = { ...current };
            delete next[disconnectTarget];
            return next;
        });
        setDisconnectTarget(null);
    };

    const [sidebarWidth, setSidebarWidth] = useState(280);
    const isResizing = useRef(false);
    const handleMouseDown = () => (isResizing.current = true);
    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const newWidth = Math.min(Math.max(e.clientX, 200), 600);
        setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => (isResizing.current = false);
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div className={`layout ${viewMode === "bag" ? "bag-mode" : "real-mode"}`}>
            <Header
                name={name}
                dropdownContent={dropdownContent}
                onAddVehicle={addVehicle}
                vehicleList={vehicleList}
                connectVehicle={handleRealConnect}
                viewMode={viewMode}
                requestBagList={requestBagList}
                openBag={handleOpenBag}
            />

            <main className="main">
                <div className="main-grid" style={{ gridTemplateColumns: `${sidebarWidth}px 6px 1fr` }}>
                    <aside className="side-bar-topic">
                        <div className="side-bar-topic-list">
                            <div className="sidebar-topic-search-wrap">
                                <span className="sidebar-topic-search-icon" aria-hidden="true">🔍</span>
                                <input
                                    type="search"
                                    className="sidebar-topic-search"
                                    value={sidebarTopicSearch}
                                    onChange={(event) => setSidebarTopicSearch(event.target.value)}
                                    placeholder="토픽명 검색"
                                    aria-label="토픽명 검색"
                                />
                            </div>
                            {content || (
                                <SidebarTop
                                    vehiclesData={visibleVehiclesData}
                                    vehicleStatuses={vehicleStatuses}
                                    onPanelSelect={handlePanelSelect}
                                    activePanelsByTopic={activePanelsByTopic}
                                    subscribeTopic={subscribeTopic}
                                    onDisconnectVehicle={viewMode === "bag" ? handleCloseBag : handleDisconnectVehicle}
                                    loggingByVehicle={loggingByVehicle}
                                    topicSearch={sidebarTopicSearch}
                                    onRefreshBag={handleRefreshBag}
                                    bagPlayback={bagPlayback}
                                    viewMode={viewMode}
                                />
                            )}
                        </div>
                    </aside>

                    <div className="sidebar-resizer" onMouseDown={handleMouseDown} />

                    <section>
                        <DataSpace
                            vehicles={vehicles}
                            vehiclesData={visibleVehiclesData}
                            vehicleStatuses={vehicleStatuses}
                            visuals={visuals}
                            onCloseVisual={(id) =>
                                setVisuals((prev) => {
                                    const target = prev.find((v) => v.id === id);
                                    if (target) {
                                        const remainingForTopic = prev.filter(
                                            (v) => v.id !== id && v.ip === target.ip && v.topic === target.topic
                                        );
                                        if (remainingForTopic.length === 0) {
                                            unsubscribeTopic(target.ip, target.topic);
                                        }
                                    }
                                    return prev.filter((v) => v.id !== id);
                                })}
                        />
                    </section>
                </div>
            </main>

            <Footer
                vehiclesData={vehiclesData}
                onLoggingChange={handleLoggingChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                bagPlayback={bagPlayback}
                onPlaybackControl={handlePlaybackControl}
                bagConnecting={bagConnecting}
            />
            <InfoBox vehiclesData={visibleVehiclesData} onResetPath={resetPath} />

            {bagChange && (
                <div
                    onClick={() => setBagChange(null)}
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#593E2E", color: "#fff", borderRadius: 8,
                            padding: "22px 24px", minWidth: 340, maxWidth: 460,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                        }}
                    >
                        {bagChange.phase === "confirm" ? (
                            <>
                                <div style={{ fontSize: 16, marginBottom: 6 }}>
                                    다른 bag으로 변경하시겠습니까?
                                </div>
                                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>
                                    {bagChange.vehicleId}
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                                    <button
                                        onClick={() => setBagChange(null)}
                                        style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #57676E", background: "transparent", color: "#fff", cursor: "pointer" }}
                                    >
                                        아니요
                                    </button>
                                    <button
                                        onClick={loadBagChangeList}
                                        style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: "#2e86de", color: "#fff", cursor: "pointer", fontWeight: "bold" }}
                                    >
                                        네
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: 16, marginBottom: 12 }}>
                                    {bagChange.vehicleId} · bag 선택
                                </div>
                                {bagChange.loading ? (
                                    <div style={{ opacity: 0.7, padding: "12px 0" }}>불러오는 중…</div>
                                ) : bagChange.error ? (
                                    <div style={{ color: "#ff8a80", padding: "12px 0" }}>{bagChange.error}</div>
                                ) : bagChange.files.length === 0 ? (
                                    <div style={{ opacity: 0.7, padding: "12px 0" }}>bag 파일이 없습니다.</div>
                                ) : (
                                    <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6 }}>
                                        {bagChange.files.map((f) => {
                                            const path = f?.path || f?.name || f;
                                            const name = f?.name || path;
                                            return (
                                                <div
                                                    key={path}
                                                    onClick={() => selectBagForChange(path)}
                                                    style={{ padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                                                    title={path}
                                                >
                                                    {name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                                    <button
                                        onClick={() => setBagChange(null)}
                                        style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #57676E", background: "transparent", color: "#fff", cursor: "pointer" }}
                                    >
                                        닫기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {disconnectTarget && (
                <div
                    onClick={() => setDisconnectTarget(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: viewMode === "bag" ? "#593E2E" : "#1B1F3B",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "22px 24px",
                            minWidth: 320,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div style={{ fontSize: 16, marginBottom: 6 }}>
                            이동체와의 연결을 종료하시겠습니까?
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>
                            {disconnectTarget}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                            <button
                                onClick={() => setDisconnectTarget(null)}
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: 6,
                                    border: "1px solid #57676E",
                                    background: "transparent",
                                    color: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={confirmDisconnect}
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: 6,
                                    border: "none",
                                    background: "#e53935",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                네
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;
