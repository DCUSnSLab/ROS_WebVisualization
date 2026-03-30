// SidebarTopic.js
import React, { useState } from "react";
import "./SidebarTopicAndStatus.css";
import SelectOutput from "./SelectOutput";

function AccordionItem({
                           topic,
                           topicType,
                           vehicleId,
                           isOpen,
                           onToggle,
                           onPanelSelect,
                           activePanelsSet = new Set(),
                           connectVehicle
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
                    connectVehicle={connectVehicle}
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
                                         connectVehicle
                                     }) {
    const [openTopics, setOpenTopics] = useState(new Set());

    const toggle = (topic) => {
        setOpenTopics((prev) => {
            const next = new Set(prev);
            next.has(topic) ? next.delete(topic) : next.add(topic);
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
                const topics = vehiclesData?.[vehicleId]?.topics || [];

                return (
                    <div key={vehicleId} className="topic-vehicle-block">
                        {topics.length ? (
                            topics.map((topicObj) => {
                                const topicName = topicObj.name;
                                const topicType = topicObj.type;

                                const isOpen = openTopics.has(topicName);
                                const activePanelsSet =
                                    activePanelsByTopic[topicName] || new Set();

                                return (
                                    <AccordionItem
                                        key={`${vehicleId}-${topicName}`}
                                        topic={topicName}
                                        vehicleId={vehicleId}
                                        topicType={topicType}
                                        isOpen={isOpen}
                                        onToggle={() => toggle(topicName)}
                                        onPanelSelect={onPanelSelect}
                                        activePanelsSet={activePanelsSet}
                                        connectVehicle={connectVehicle}
                                    />
                                );
                            })
                        ) : (
                            <div className="no-topic">토픽 없음</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

