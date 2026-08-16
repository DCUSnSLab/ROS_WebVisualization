import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarTopic from "../../Sidebar/SidebarTopic";

const AccordionItem = ({ title, content, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen((v) => !v);
    return (
        <div className="siderbar">
            {/* 헤더 행 전체가 하나의 배경(.siderbar-btn)을 공유 → 검은 박스 방지 */}
            <div
                className="siderbar-btn"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#111" }}
            >
                <span
                    onClick={toggle}
                    style={{ display: "flex", alignItems: "center", flex: 1, cursor: "pointer" }}
                >
                    {title}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span onClick={toggle} style={{ cursor: "pointer" }}>
                        {isOpen ? "▲" : "▼"}
                    </span>
                    {onClose && (
                        <span
                            onClick={onClose}
                            title="이동체 연결 종료"
                            style={{ cursor: "pointer", fontWeight: "bold", color: "#e53935" }}
                        >
                            ✕
                        </span>
                    )}
                </span>
            </div>
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
                                       subscribeTopic,
                                       onDisconnectVehicle
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
                    onClose={
                        onDisconnectVehicle
                            ? () => onDisconnectVehicle(vehicleId)
                            : undefined
                    }
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
