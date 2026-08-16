// MainLayout.js
import React, { useState, useRef, useEffect, useMemo } from "react";
import "./MainLayout.css";
import Header from "./MainHeader";
import Footer from "./MainFooter";
import SidebarTop from "./SidebarTop";
import DataSpace from "../DataViewerLayout/DataSpace";
import InfoBox from "../DataViewerLayout/InfoBox";
import UseRosVehicles from "./UseRosVehicles";

const MainLayout = ({ name, dropdownContent, content }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenVehicle, setIsOpenVehicle] = useState(true);
    const [vehicles, setVehicles] = useState([]);

    // const { vehiclesData, vehicleList } = UseRosVehicles(vehicles);
    const { vehiclesData, vehicleList, vehicleStatuses, requestTopicList, subscribeTopic, unsubscribeTopic, resetPath } = UseRosVehicles();

    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedPanel, setSelectedPanel] = useState("");

    // 차량 추가/삭제 (기존대로)
    const addVehicle = (rawIP, vehicleName) => {
        if (!rawIP || !vehicleName) return;
        const vehicleIP = `ws://${rawIP}`;
        setVehicles((prev) => (prev.some((v) => v.ip === vehicleIP) ? prev : [...prev, { ip: vehicleIP, name: vehicleName }]));
    };
    const removeVehicle = (ip) => setVehicles((prev) => prev.filter((v) => v.ip !== ip));

    const [visuals, setVisuals] = useState([]);

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
        <div className="layout">
            <Header
                name={name}
                dropdownContent={dropdownContent}
                onAddVehicle={addVehicle}
                vehicleList={vehicleList}
                connectVehicle={requestTopicList}
            />

            <main className="main">
                <div className="main-grid" style={{ gridTemplateColumns: `${sidebarWidth}px 6px 1fr` }}>
                    <aside className="side-bar-topic">
                        <div className="side-bar-topic-list">
                            <button className="side-btn" onClick={() => setIsOpen(!isOpen)}>
                                <span>{isOpen ? "▲ " : "▼ "}</span>
                                Topic
                            </button>
                            <div className="side-title" />
                            {isOpen &&
                                (content || (
                                    <SidebarTop
                                        vehiclesData={vehiclesData}
                                        vehicleStatuses={vehicleStatuses}
                                        onPanelSelect={handlePanelSelect}
                                        activePanelsByTopic={activePanelsByTopic}
                                        subscribeTopic={subscribeTopic}
                                    />
                                ))}
                        </div>
                    </aside>

                    <div className="sidebar-resizer" onMouseDown={handleMouseDown} />

                    <section>
                        <DataSpace
                            vehicles={vehicles}
                            vehiclesData={vehiclesData}
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

            <Footer />
            <InfoBox vehiclesData={vehiclesData} onResetPath={resetPath} />
        </div>
    );
};

export default MainLayout;
