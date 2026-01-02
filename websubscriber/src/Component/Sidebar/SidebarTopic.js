// SidebarTopic.js
import React, { useState } from "react";
import "./SidebarTopicAndStatus.css";
import SelectOutput from "./SelectOutput";

function AccordionItem({
                           topic,
                           ip,
                           isOpen,
                           onToggle,
                           onPanelSelect,
                           activePanelsSet = new Set(), // topic에 대해 활성화된 패널들

                       }) {

    const isActive = activePanelsSet.size > 0; // 하나라도 켜져 있으면 색 하이라이트



    return (

        <div style={{ marginBottom: 3 }}>

            <button

                className={`topic-chip ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`}

                onClick={onToggle}

                title={topic}

                style={{

                    width: "100%",

                    textAlign: "left",

                    whiteSpace: "normal",

                    wordBreak: "break-all",

                }}

            >

                {topic}

            </button>



            {isOpen && (

                <SelectOutput

                    topic={topic}

                    ip={ip}

                    // topic에 대해 어떤 패널들이 활성인지 내려줘서 버튼 개별 하이라이트

                    activePanels={activePanelsSet}

                    // onSelect={onPanelSelect}
                    onSelect={({ topic, panel }) => onPanelSelect && onPanelSelect({topic, panel, ip})}
                />

            )}

        </div>

    );

}



export default function SidebarTopic({

                                         vehicles,

                                         vehiclesData,

                                         onPanelSelect,           // ({topic, panel})

                                         activePanelsByTopic = {},

                                     }) {

    const [openTopics, setOpenTopics] = useState(new Set());



    if (!vehicles || vehicles.length === 0) {

        return (

            <div className="sidebar-bg">

                <p style={{ color: "#aaa", fontSize: 13 }}>연결된 차량이 없습니다.</p>

            </div>

        );

    }



    const toggle = (topic) => {

        setOpenTopics((prev) => {

            const next = new Set(prev);

            next.has(topic) ? next.delete(topic) : next.add(topic);

            return next;

        });

    };



    return (

        <div className="sidebar-bg">

            {vehicles.map(({ ip }) => {

                const topics = vehiclesData?.[ip]?.topics || [];

                return (

                    <div key={ip} className="topic-vehicle-block" style={{ color: "black" }}>

                        {topics.length ? (

                            topics.map((topic) => {

                                const isOpen = openTopics.has(topic);

                                const activePanelsSet = activePanelsByTopic[topic] || new Set();

                                return (

                                    <AccordionItem

                                        key={`${ip}-${topic}`}

                                        topic={topic}

                                        ip={ip}

                                        isOpen={isOpen}

                                        onToggle={() => toggle(topic)}

                                        onPanelSelect={onPanelSelect}

                                        activePanelsSet={activePanelsSet}

                                    />

                                );

                            })

                        ) : (

                            <div className="no-topic">토픽을 불러오는 중...</div>

                        )}

                    </div>

                );

            })}

        </div>

    );

}

