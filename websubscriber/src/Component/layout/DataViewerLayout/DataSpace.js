import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MdCloseFullscreen, MdOpenInNew } from "react-icons/md";
import Kakaomap from "./kakaomap";
import ImageLR from "../../../Component/ImageLR";
import PCL from "../../../Component/PCL";
import Stream from "../../../Component/StreamChart";
import RawMessageComponent from "../../../Component/RawMessageComponent";
import "./DataSpace.css";

const isVehicleDisconnected = (vehicle, status) => {
    if (vehicle?.isBag) return false;
    if (!status || status.msAgo == null || status.receivedAt == null) return true;

    const age = status.msAgo + (Date.now() - status.receivedAt);
    return age >= 5000;
};

function DetachedWindowPortal({ id, externalWindow, title, onWindowClosed, children }) {
    const [container] = useState(() => externalWindow.document.createElement("div"));

    useEffect(() => {
        const popupDocument = externalWindow.document;
        popupDocument.title = title;
        popupDocument.documentElement.style.width = "100%";
        popupDocument.documentElement.style.height = "100%";
        popupDocument.body.className = "detached-visual-window";
        container.className = "detached-window-root";

        document
            .querySelectorAll('link[rel="stylesheet"], style')
            .forEach((styleNode) => popupDocument.head.appendChild(styleNode.cloneNode(true)));

        popupDocument.body.appendChild(container);

        const handleBeforeUnload = () => onWindowClosed(id);
        externalWindow.addEventListener("beforeunload", handleBeforeUnload);
        externalWindow.focus();

        return () => {
            externalWindow.removeEventListener("beforeunload", handleBeforeUnload);
            container.remove();
            if (!externalWindow.closed) externalWindow.close();
        };
    }, [container, externalWindow, id, onWindowClosed, title]);

    return createPortal(children, container);
}

function VisualRenderer({
                            panel,
                            topic,
                            vehicleId,
                            data,
                            rawData,
                            disconnected,
                            detached = false,
                            onToggleWindow,
                            onClose
                        }) {
    return (
        <div className="visual-card">
            <div className={`visual-card-header ${disconnected ? "disconnected" : ""}`}>
                <div className="visual-title">
                    <span className="visual-vehicle-id">{vehicleId}</span>
                    <span>{panel} - {topic}</span>
                </div>
                <div className="visual-actions">
                    <button
                        type="button"
                        className="visual-window-button"
                        onClick={onToggleWindow}
                        title={detached ? "기본 화면으로 돌아가기" : "새 창으로 분리"}
                        aria-label={detached ? "기본 화면으로 돌아가기" : "새 창으로 분리"}
                    >
                        {detached ? <MdCloseFullscreen /> : <MdOpenInNew />}
                    </button>
                    <button
                        type="button"
                        className="visual-close"
                        onClick={onClose}
                        title="시각화 닫기"
                        aria-label="시각화 닫기"
                    >
                        X
                    </button>
                </div>
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

export default function DataSpace({
                                      vehicles,
                                      vehiclesData,
                                      vehicleStatuses,
                                      visuals = [],
                                      onCloseVisual
                                  }) {
    const [leftPanelWidth, setLeftPanelWidth] = useState("50%");
    const [detachedWindows, setDetachedWindows] = useState(() => new Map());
    const [, setStatusTick] = useState(0);
    const isResizing = useRef(false);
    const splitPaneRef = useRef(null);

    const handleWindowClosed = useCallback((id) => {
        setDetachedWindows((current) => {
            if (!current.has(id)) return current;
            const next = new Map(current);
            next.delete(id);
            return next;
        });
    }, []);

    const handleDetach = (id) => {
        const existingWindow = detachedWindows.get(id);
        if (existingWindow && !existingWindow.closed) {
            existingWindow.focus();
            return;
        }

        const popupWindow = window.open(
            "",
            `sensor_visual_${Date.now()}`,
            "popup=yes,width=720,height=520,resizable=yes,scrollbars=yes"
        );

        if (!popupWindow) {
            window.alert("팝업이 차단되었습니다. 브라우저에서 팝업을 허용해 주세요.");
            return;
        }

        setDetachedWindows((current) => {
            const next = new Map(current);
            next.set(id, popupWindow);
            return next;
        });
    };

    const handleCloseDetachedVisual = (id) => {
        const popupWindow = detachedWindows.get(id);
        handleWindowClosed(id);
        if (popupWindow && !popupWindow.closed) popupWindow.close();
        onCloseVisual(id);
    };

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
        const statusTimer = window.setInterval(() => setStatusTick((tick) => tick + 1), 1000);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.clearInterval(statusTimer);
        };
    }, [handleMouseMove, handleMouseUp]);

    useEffect(() => {
        const activeVisualIds = new Set(visuals.map((visual) => visual.id));

        setDetachedWindows((current) => {
            let changed = false;
            const next = new Map(current);

            current.forEach((popupWindow, id) => {
                if (!activeVisualIds.has(id)) {
                    if (popupWindow && !popupWindow.closed) popupWindow.close();
                    next.delete(id);
                    changed = true;
                }
            });

            return changed ? next : current;
        });
    }, [visuals]);

    const attachedVisuals = visuals.filter((visual) => !detachedWindows.has(visual.id));
    const detachedVisuals = visuals.filter((visual) => detachedWindows.has(visual.id));

    const renderVisual = (visual, detached = false) => {
        const { id, topic, panel, ip } = visual;
        const vehicle = vehiclesData?.[ip];
        const data = vehicle?.topicsData?.[topic];
        const rawData = vehicle?.rawTopicsData?.[topic];
        const disconnected = isVehicleDisconnected(vehicle, vehicleStatuses?.[ip]);

        return (
            <VisualRenderer
                topic={topic}
                panel={panel}
                vehicleId={ip}
                data={data}
                rawData={rawData}
                disconnected={disconnected}
                detached={detached}
                onToggleWindow={
                    detached ? () => handleWindowClosed(id) : () => handleDetach(id)
                }
                onClose={
                    detached ? () => handleCloseDetachedVisual(id) : () => onCloseVisual(id)
                }
            />
        );
    };

    const detachedPortals = detachedVisuals.map((visual) => {
        const popupWindow = detachedWindows.get(visual.id);
        if (!popupWindow || popupWindow.closed) return null;

        return (
            <DetachedWindowPortal
                key={visual.id}
                id={visual.id}
                externalWindow={popupWindow}
                title={`${visual.ip} - ${visual.topic}`}
                onWindowClosed={handleWindowClosed}
            >
                {renderVisual(visual, true)}
            </DetachedWindowPortal>
        );
    });

    if (!attachedVisuals.length) {
        return (
            <>
                <div className="dataspace-full">
                    <Kakaomap vehicles={vehicles} vehiclesData={vehiclesData} />
                </div>
                {detachedPortals}
            </>
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
                {attachedVisuals.map((visual) => (
                    <React.Fragment key={visual.id}>{renderVisual(visual)}</React.Fragment>
                ))}
            </div>
            {detachedPortals}
        </div>
    );
}
