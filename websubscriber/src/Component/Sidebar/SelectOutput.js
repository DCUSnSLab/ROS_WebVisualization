// SelectOutput.js
import React from "react";

export default function SelectOutput({ topic, vehicleId, topicType, subscribeTopic, onSelect, activePanels = new Set() }) {
    const panels = [
        { label: "Image", value: "Image" },
        { label: "PointCloud", value: "PointCloud" },
        { label: "Plot", value: "Plot" },
        { label: "RawMessage", value: "RawMessage" },
    ];

    const handleClick = (panel) => {
        subscribeTopic && subscribeTopic(vehicleId, topic, topicType);
        onSelect && onSelect({ topic, panel, vehicleId });
    };

    return (
        <div style={{ padding: "10px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {panels.map(({ label, value }) => {
                    const isActive = activePanels.has(value);
                    return (
                        <button
                            key={value}
                            onClick={() => handleClick(value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                backgroundColor: isActive ? "#1B1F3B" : "white",
                                color: isActive ? "white" : "black",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                            title={`${topic} → ${label}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
