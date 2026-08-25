import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    MdCloseFullscreen,
    MdOpenInNew,
    MdVerticalSplit,
    MdHorizontalSplit
} from "react-icons/md";
import Kakaomap from "./kakaomap";
import ImageLR from "../../../Component/ImageLR";
import PCL from "../../../Component/PCL";
import Stream from "../../../Component/StreamChart";
import RawMessageComponent from "../../../Component/RawMessageComponent";
import "./DataSpace.css";

// 오른쪽 시각화 영역을 최대 몇 개의 칸(pane)까지 나눌지
const MAX_PANES = 6;

// 레이아웃 트리 노드 id 생성기
let nodeSeq = 0;
const newId = (prefix) => `${prefix}_${++nodeSeq}`;

// ── 레이아웃 트리 헬퍼 (노드: pane | split) ─────────────────────────
// pane:  { id, type:"pane", tabs:[visualId], activeId }
// split: { id, type:"split", dir:"row"|"col", children:[node,node], sizes:[a,b] }

const collectVisualIds = (node, out) => {
    if (!node) return out;
    if (node.type === "pane") {
        node.tabs.forEach((id) => out.add(id));
        return out;
    }
    node.children.forEach((child) => collectVisualIds(child, out));
    return out;
};

const countPanes = (node) => {
    if (!node) return 0;
    if (node.type === "pane") return 1;
    return node.children.reduce((sum, child) => sum + countPanes(child), 0);
};

const findLastPane = (node) => {
    if (!node) return null;
    if (node.type === "pane") return node;
    return findLastPane(node.children[node.children.length - 1]);
};

const findPane = (node, paneId) => {
    if (!node) return null;
    if (node.type === "pane") return node.id === paneId ? node : null;
    for (const child of node.children) {
        const found = findPane(child, paneId);
        if (found) return found;
    }
    return null;
};

// keepSet에 없는 시각화 제거 → 빈 pane/single-child split 정리
const pruneTree = (node, keepSet) => {
    if (!node) return null;
    if (node.type === "pane") {
        const tabs = node.tabs.filter((id) => keepSet.has(id));
        if (!tabs.length) return null;
        let activeId = node.activeId;
        if (!tabs.includes(activeId)) activeId = tabs[tabs.length - 1];
        return { ...node, tabs, activeId };
    }
    const children = node.children
        .map((child) => pruneTree(child, keepSet))
        .filter(Boolean);
    if (children.length === 0) return null;
    if (children.length === 1) return children[0]; // 한쪽이 비면 split 해제
    return { ...node, children };
};

// paneId에 매칭되는 pane을 fn 결과로 교체
const replacePane = (node, paneId, fn) => {
    if (!node) return node;
    if (node.type === "pane") return node.id === paneId ? fn(node) : node;
    return { ...node, children: node.children.map((child) => replacePane(child, paneId, fn)) };
};

// nodeId 노드에 patch 적용 (split의 sizes 갱신용)
const updateNode = (node, nodeId, patch) => {
    if (!node) return node;
    if (node.id === nodeId) return { ...node, ...patch };
    if (node.type === "split") {
        return { ...node, children: node.children.map((child) => updateNode(child, nodeId, patch)) };
    }
    return node;
};

// 마지막(가장 오른쪽/아래) pane에 새 시각화 추가 (없으면 pane 생성)
const addVisualsToLast = (node, ids) => {
    if (!ids.length) return node;
    if (!node) {
        return { id: newId("pane"), type: "pane", tabs: [...ids], activeId: ids[ids.length - 1] };
    }
    const last = findLastPane(node);
    return replacePane(node, last.id, (pane) => ({
        ...pane,
        tabs: [...pane.tabs, ...ids],
        activeId: ids[ids.length - 1]
    }));
};

// paneId를 split으로 감싸 movingId를 새 pane으로 분리
const splitPaneInTree = (node, paneId, dir, movingId) => {
    const transform = (current) => {
        if (!current) return current;
        if (current.type === "pane") {
            if (current.id !== paneId) return current;
            const remaining = current.tabs.filter((id) => id !== movingId);
            const updatedPane = {
                ...current,
                tabs: remaining,
                activeId: remaining[remaining.length - 1]
            };
            const createdPane = {
                id: newId("pane"),
                type: "pane",
                tabs: [movingId],
                activeId: movingId
            };
            return {
                id: newId("split"),
                type: "split",
                dir,
                children: [updatedPane, createdPane],
                sizes: [50, 50]
            };
        }
        return { ...current, children: current.children.map(transform) };
    };
    return transform(node);
};

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
                            onClose,
                            onSplitRight,
                            onSplitDown
                        }) {
    return (
        <div className="visual-card">
            <div className={`visual-card-header ${disconnected ? "disconnected" : ""}`}>
                <div className="visual-title">
                    <span className="visual-vehicle-id">{vehicleId}</span>
                    <span className="visual-title-text">{panel} - {topic}</span>
                </div>
                <div className="visual-actions">
                    {onSplitRight && (
                        <button
                            type="button"
                            className="visual-window-button"
                            onClick={onSplitRight}
                            title="오른쪽으로 분할"
                            aria-label="오른쪽으로 분할"
                        >
                            <MdVerticalSplit />
                        </button>
                    )}
                    {onSplitDown && (
                        <button
                            type="button"
                            className="visual-window-button"
                            onClick={onSplitDown}
                            title="아래로 분할"
                            aria-label="아래로 분할"
                        >
                            <MdHorizontalSplit />
                        </button>
                    )}
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
    // 오른쪽 시각화 영역의 탭/분할 레이아웃 트리 (루트 노드 또는 null)
    const [layout, setLayout] = useState(null);
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

    // 지도 ↔ 센서 영역 경계 리사이즈
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

    // 분리된 창이 닫히거나 시각화가 사라지면 팝업 정리
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

    // 부착된 시각화 목록에 맞춰 레이아웃 트리 동기화
    useEffect(() => {
        const attachedIds = visuals
            .filter((visual) => !detachedWindows.has(visual.id))
            .map((visual) => visual.id);
        const keep = new Set(attachedIds);

        setLayout((prev) => {
            let next = pruneTree(prev, keep);
            const survived = collectVisualIds(next, new Set());
            const newIds = attachedIds.filter((id) => !survived.has(id));
            if (newIds.length) next = addVisualsToLast(next, newIds);
            return next;
        });
    }, [visuals, detachedWindows]);

    const setActiveTab = (paneId, visualId) => {
        setLayout((prev) => replacePane(prev, paneId, (pane) => ({ ...pane, activeId: visualId })));
    };

    const splitPane = (paneId, dir) => {
        setLayout((prev) => {
            if (countPanes(prev) >= MAX_PANES) return prev;
            const pane = findPane(prev, paneId);
            if (!pane || pane.tabs.length < 2) return prev;
            return splitPaneInTree(prev, paneId, dir, pane.activeId);
        });
    };

    // split 경계 드래그 리사이즈
    const startResize = (e, node, horizontal) => {
        e.preventDefault();
        const container = e.currentTarget.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();

        const onMove = (moveEvent) => {
            const pos = horizontal ? moveEvent.clientX - rect.left : moveEvent.clientY - rect.top;
            const total = horizontal ? rect.width : rect.height;
            if (total <= 0) return;
            const pct = Math.max(10, Math.min(90, (pos / total) * 100));
            setLayout((prev) => updateNode(prev, node.id, { sizes: [pct, 100 - pct] }));
        };
        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const visualById = new Map(visuals.map((visual) => [visual.id, visual]));
    const attachedVisuals = visuals.filter((visual) => !detachedWindows.has(visual.id));
    const detachedVisuals = visuals.filter((visual) => detachedWindows.has(visual.id));

    const renderVisual = (visual, detached = false, paneCtx = null) => {
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
                onSplitRight={paneCtx?.canSplit ? () => splitPane(paneCtx.paneId, "row") : undefined}
                onSplitDown={paneCtx?.canSplit ? () => splitPane(paneCtx.paneId, "col") : undefined}
            />
        );
    };

    // pane 노드 렌더 (탭바 + 활성 카드)
    const renderPane = (node) => {
        const paneVisuals = node.tabs.map((id) => visualById.get(id)).filter(Boolean);
        if (!paneVisuals.length) return null;

        const activeVisual =
            visualById.get(node.activeId) || paneVisuals[paneVisuals.length - 1];
        const paneCtx = {
            paneId: node.id,
            canSplit: node.tabs.length >= 2 && countPanes(layout) < MAX_PANES
        };

        return (
            <div className="visual-pane-col">
                {paneVisuals.length > 1 && (
                    <div className="visual-tabbar">
                        {paneVisuals.map((visual) => (
                            <div
                                key={visual.id}
                                className={`visual-tab ${
                                    visual.id === activeVisual?.id ? "active" : ""
                                }`}
                                onClick={() => setActiveTab(node.id, visual.id)}
                                title={`${visual.ip} - ${visual.panel} - ${visual.topic}`}
                            >
                                <span className="visual-tab-label">
                                    {visual.ip} · {visual.panel}
                                </span>
                                <button
                                    type="button"
                                    className="visual-tab-close"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCloseVisual(visual.id);
                                    }}
                                    title="탭 닫기"
                                    aria-label="탭 닫기"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="visual-pane-body">
                    {activeVisual && renderVisual(activeVisual, false, paneCtx)}
                </div>
            </div>
        );
    };

    // 레이아웃 트리 재귀 렌더
    const renderNode = (node) => {
        if (!node) return null;
        if (node.type === "pane") return renderPane(node);

        const horizontal = node.dir === "row";
        const [sizeA, sizeB] = node.sizes;

        return (
            <div className={`layout-split ${horizontal ? "row" : "col"}`}>
                <div className="layout-child" style={{ flex: `0 1 ${sizeA}%` }}>
                    {renderNode(node.children[0])}
                </div>
                <div
                    className={horizontal ? "dataspace-resizer-h" : "dataspace-resizer-v"}
                    onMouseDown={(e) => startResize(e, node, horizontal)}
                />
                <div className="layout-child" style={{ flex: `0 1 ${sizeB}%` }}>
                    {renderNode(node.children[1])}
                </div>
            </div>
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
                {renderNode(layout)}
            </div>
            {detachedPortals}
        </div>
    );
}
