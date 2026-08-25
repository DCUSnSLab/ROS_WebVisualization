// SidebarTopic.js
import React, { useState } from "react";
import "./SidebarTopicAndStatus.css";
import SelectOutput from "./SelectOutput";

// 고정 카테고리 순서
const GROUP_ORDER = ["카메라", "라이다", "imu", "gps", "차량 정보", "tf", "기타"];

// 차량 정보로 묶을 토픽(이름에 이 키워드가 포함되면)
const VEHICLE_INFO_KEYS = [
    "hunter_status",
    "pubcpu",
    "pubram",
    "pubgpu",
    "pubscvip",
    "pubscvstatus",
];

const getSensorGroupName = (topic) => {
    const explicitGroup =
        topic?.sensor_group ||
        topic?.sensorGroup ||
        topic?.sensor_name ||
        topic?.sensorName;
    if (explicitGroup) return String(explicitGroup);

    const name = (topic?.name || "").toLowerCase();
    const base = name.replace(/^\/+/, "");

    // 순서 중요: 위에서부터 먼저 매칭되는 카테고리로 분류
    // /zed 로 시작하는 건 (imu/pointcloud 포함) 전부 카메라(ZED)로
    if (base.startsWith("zed")) return "카메라";
    if (VEHICLE_INFO_KEYS.some((key) => base.includes(key))) return "차량 정보";
    if (/camera|image/.test(name)) return "카메라";
    if (/velodyne|lidar|point_?cloud|points|scan/.test(name)) return "라이다";
    if (/imu|vectornav/.test(name)) return "imu"; // vectornav(INS) 전체를 imu로
    if (/gps|ublox|gnss|navpvt|navsat/.test(name)) return "gps";
    if (base === "tf" || base === "tf_static") return "tf";
    return "기타";
};

const groupTopicsBySensor = (topics) => {
    const groupedTopics = new Map();

    topics.forEach((topic) => {
        const groupName = getSensorGroupName(topic);
        if (!groupedTopics.has(groupName)) {
            groupedTopics.set(groupName, []);
        }
        groupedTopics.get(groupName).push(topic);
    });

    const groups = Array.from(groupedTopics, ([name, groupTopics]) => ({
        name,
        topics: groupTopics,
    }));

    return groups.sort((a, b) => {
        const ia = GROUP_ORDER.indexOf(a.name);
        const ib = GROUP_ORDER.indexOf(b.name);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
};

function AccordionItem({
                           topic,
                           topicType,
                           vehicleId,
                           isOpen,
                           onToggle,
                           onPanelSelect,
                           activePanelsSet = new Set(),
                           subscribeTopic
                       }) {
    const isActive = activePanelsSet.size > 0;

    return (
        <div style={{ marginBottom: 3 }}>
            <button
                className={`topic-chip ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`}
                onClick={() => {
                    onToggle()
                }}
            >
                {topic}
            </button>

            {isOpen && (
                <SelectOutput
                    topic={topic}
                    vehicleId={vehicleId}
                    topicType={topicType}
                    subscribeTopic={subscribeTopic}
                    activePanels={activePanelsSet}
                    onSelect={({ topic, panel }) =>
                        onPanelSelect && onPanelSelect({
                            topic,
                            panel,
                            ip: vehicleId
                        })
                    }
                />
            )}
        </div>
    );
}


export default function SidebarTopic({
                                         vehicleList,
                                         vehiclesData,
                                         onPanelSelect,
                                         activePanelsByTopic = {},
                                         subscribeTopic,
                                         topicSearch = "",
                                         openTopicKey = null,
                                         onTopicToggle
                                     }) {
    // 센서 그룹 접기/펼치기 상태 (기본: 모두 펼침)
    const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
    const toggleGroup = (groupKey) => {
        setCollapsedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupKey)) next.delete(groupKey);
            else next.add(groupKey);
            return next;
        });
    };

    if (!vehicleList || vehicleList.length === 0) {
        return (
            <div className="sidebar-bg">
                <p style={{ color: "#aaa", fontSize: 13 }}>
                    연결된 차량이 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="sidebar-bg">
            {vehicleList.map((vehicleId) => {
                const allTopics = vehiclesData?.[vehicleId]?.topics || [];
                const normalizedTopicSearch = topicSearch.trim().toLocaleLowerCase();
                const topics = normalizedTopicSearch
                    ? allTopics.filter((topic) =>
                        (topic?.name || "").toLocaleLowerCase().includes(normalizedTopicSearch)
                    )
                    : allTopics;
                const sensorGroups = groupTopicsBySensor(topics);

                return (
                    <div key={vehicleId} className="topic-vehicle-block">
                        {topics.length ? (
                            sensorGroups.map((sensorGroup) => {
                                const groupKey = `${vehicleId}::${sensorGroup.name}`;
                                // 검색 중이면 항상 펼침, 아니면 접힘 상태 반영
                                const collapsed =
                                    !normalizedTopicSearch && collapsedGroups.has(groupKey);

                                return (
                                    <section className="sensor-topic-group" key={groupKey}>
                                        <div
                                            className="sensor-topic-group-title"
                                            style={{ cursor: "pointer", userSelect: "none" }}
                                            onClick={() => toggleGroup(groupKey)}
                                        >
                                            <span className="sensor-topic-group-caret">
                                                {collapsed ? "▸" : "▾"}
                                            </span>
                                            <span>{sensorGroup.name}</span>
                                            <span className="sensor-topic-group-count">
                                                {sensorGroup.topics.length}
                                            </span>
                                        </div>
                                        {!collapsed && (
                                            <div className="sensor-topic-group-list">
                                                {sensorGroup.topics.map((topicObj) => {
                                                    const topicName = topicObj.name;
                                                    const topicType = topicObj.type;
                                                    const topicKey = `${vehicleId}::${topicName}`;
                                                    const isOpen = openTopicKey === topicKey;
                                                    const activePanelsSet =
                                                        activePanelsByTopic[topicKey] || new Set();

                                                    return (
                                                        <AccordionItem
                                                            key={`${vehicleId}-${topicName}`}
                                                            topic={topicName}
                                                            vehicleId={vehicleId}
                                                            topicType={topicType}
                                                            isOpen={isOpen}
                                                            onToggle={() => onTopicToggle?.(topicKey)}
                                                            onPanelSelect={onPanelSelect}
                                                            activePanelsSet={activePanelsSet}
                                                            subscribeTopic={subscribeTopic}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </section>
                                );
                            })
                        ) : (
                            <div className="no-topic">
                                {allTopics.length > 0 ? "검색 결과 없음" : "토픽 없음"}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

