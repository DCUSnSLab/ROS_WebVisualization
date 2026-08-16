import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarTopic from "../../Sidebar/SidebarTopic";

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="siderbar">
            <button className="siderbar-btn" onClick={() => setIsOpen(!isOpen)} style={{ justifyContent: "space-between" }}>
                {title}
                <span>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && <div className="siderbar-content">{content}</div>}
        </div>
    );
};

// 차량 연결 상태 → 색상
// 초록: 2초 이내 응답(정상) / 노랑: 2~5초(응답이 끊기기 시작) / 빨강: 5초 이상 or 미수신
function statusColor(status) {
    if (!status || status.msAgo == null) return "#e53935"; // red
    const age = status.msAgo + (Date.now() - status.receivedAt);
    if (age <= 2000) return "#43a047"; // green
    if (age < 5000) return "#fbc02d";  // yellow
    return "#e53935";                  // red
}

export default function SidebarTop({
                                       vehiclesData,
                                       vehicleStatuses,
                                       onPanelSelect,
                                       activePanelsByTopic,
                                       subscribeTopic
                                     }) {
    // 색상이 시간 경과에 따라 갱신되도록 1초마다 리렌더
    const [, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick((n) => n + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const connectedVehicles = Object.entries(vehiclesData || {}).filter(
        ([, vehicleData]) =>
            vehicleData &&
            Object.prototype.hasOwnProperty.call(vehicleData, "topics")
    );

    return (
        <div className="siderbar-scroll">
            {connectedVehicles.map(([vehicleId]) => (
                <AccordionItem
                    key={vehicleId}
                    title={
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <span
                                title="차량 연결 상태"
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: statusColor(vehicleStatuses?.[vehicleId]),
                                    display: "inline-block",
                                    flexShrink: 0,
                                }}
                            />
                            {vehicleId}
                        </span>
                    }
                    content={
                        <SidebarTopic
                            vehicleList={[vehicleId]}
                            vehiclesData={vehiclesData}
                            onPanelSelect={onPanelSelect}
                            activePanelsByTopic={activePanelsByTopic}
                            subscribeTopic={subscribeTopic}
                        />
                    }
                />
            ))}
        </div>
    );
}
