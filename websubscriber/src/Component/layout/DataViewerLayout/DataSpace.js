import React, { useState, useRef, useEffect, useCallback } from "react";
import Kakaomap from "./kakaomap";
import ImageLR from "../../../Component/ImageLR";
import PCL from "../../../Component/PCL";
import Stream from "../../../Component/StreamChart";
import RawMessageComponent from "../../../Component/RawMessageComponent";
import "./DataSpace.css";

function VisualRenderer({ panel, topic, vehicleId, data, rawData, onClose }) {
    return (
        <div className="visual-card">
            <div className="visual-card-header">
                <div className="visual-title">{panel} - {topic}</div>
                <button className="visual-close" onClick={onClose}>X</button>
            </div>
            <div className="visual-body">
                {panel === "Image" && <ImageLR data={data} />}
                {panel === "PointCloud" && (
                    <PCL
                        topic={topic}
                        vehicleId={vehicleId}
                        data={data}
                    />
                )}
                {panel === "Plot" && <Stream data={data} />}
                {panel === "RawMessage" && <RawMessageComponent data={rawData ?? data} />}
            </div>
        </div>
    );
}

export default function DataSpace({ vehicles, vehiclesData, visuals = [], onCloseVisual }) {
    const [leftPanelWidth, setLeftPanelWidth] = useState("50%");
    const isResizing = useRef(false);
    const splitPaneRef = useRef(null);

    const handleMouseDown = (e) => {
        isResizing.current = true;
        e.preventDefault();
    };

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current || !splitPaneRef.current) return;

        const rect = splitPaneRef.current.getBoundingClientRect();
        const newLeftWidth = e.clientX - rect.left;
        const totalWidth = rect.width;
        const newLeftPercent = Math.max(20, Math.min(80, (newLeftWidth / totalWidth) * 100));

        setLeftPanelWidth(`${newLeftPercent}%`);
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    if (!visuals.length) {
        return (
            <div className="dataspace-full">
                <Kakaomap vehicles={vehicles} vehiclesData={vehiclesData} />
            </div>
        );
    }

    return (
        <div
            className="dataspace-split"
            ref={splitPaneRef}
            style={{ gridTemplateColumns: `${leftPanelWidth} 6px 1fr` }}
        >
            <div className="map-pane">
                <Kakaomap vehicles={vehicles} vehiclesData={vehiclesData} leftPanelWidth={leftPanelWidth} />
            </div>
            <div className="dataspace-resizer" onMouseDown={handleMouseDown} />
            <div className="visuals-pane">
                {visuals.map(({ id, topic, panel, ip }) => {
                    const vehicle = vehiclesData?.[ip];
                    const data = vehicle?.topicsData?.[topic];
                    const rawData = vehicle?.rawTopicsData?.[topic];

                    return (
                        <VisualRenderer
                            key={id}
                            topic={topic}
                            panel={panel}
                            vehicleId={ip}
                            data={data}
                            rawData={rawData}
                            onClose={() => onCloseVisual(id)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
