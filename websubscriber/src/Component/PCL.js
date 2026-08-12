import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { subscribeBinary } from "../binaryStreamBus";

// 초기 버퍼 용량(점 개수). 더 큰 프레임이 오면 자동으로 키운다.
const INITIAL_CAPACITY = 20000;

// 릴레이에서 바이너리로 전달된 포인트 클라우드를 순수 Three.js로 렌더.
// 데이터는 React state가 아니라 binaryStreamBus로 직접 받는다(리렌더 없음).
// data.points: Float32Array (xyz 또는 xyz+intensity 인터리브)
export default function PCL({ topic, vehicleId }) {
    const containerRef = useRef(null);

    // 최신 프레임만 보관(conflation): rAF 한 틱에 여러 개 와도 마지막 것만 그린다.
    const latestRef = useRef(null);
    const hasNewRef = useRef(false);

    // 씬 / 카메라 / 렌더러 / 컨트롤 초기화
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 400;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        // Camera (기존 ROS3D Viewer에 가깝게, Z-up, 시점 고정)
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 1000);
        camera.up.set(0, 0, 1);
        camera.position.set(3, 3, 3);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(width, height);
        // 캔버스를 컨테이너에 absolute로 겹쳐 레이아웃 흐름에서 제외.
        // 이렇게 하면 컨테이너 크기가 부모(패널)에 의해서만 정해져, 리사이즈 시 캔버스가 정확히 따라온다.
        renderer.domElement.style.display = "block";
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.left = "0";
        container.appendChild(renderer.domElement);

        // Grid (ROS XY 평면)
        const grid = new THREE.GridHelper(10, 10, 0xcccccc, 0xcccccc);
        grid.rotation.x = Math.PI / 2;
        scene.add(grid);

        // XYZ 축
        const origin = new THREE.Vector3(0, 0, 0);
        const AXIS_LEN = 1;
        const axisX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, AXIS_LEN, 0xff0000, AXIS_LEN * 0.2, AXIS_LEN * 0.12);
        const axisY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, AXIS_LEN, 0x00ff00, AXIS_LEN * 0.2, AXIS_LEN * 0.12);
        const axisZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, AXIS_LEN, 0x0000ff, AXIS_LEN * 0.2, AXIS_LEN * 0.12);
        scene.add(axisX, axisY, axisZ);

        // PointCloud - 버퍼를 미리 할당해두고 재사용(매 프레임 new 안 함 → GC 멈춤 방지)
        const geometry = new THREE.BufferGeometry();
        let capacity = INITIAL_CAPACITY;
        let posAttr = new THREE.BufferAttribute(new Float32Array(capacity * 3), 3);
        posAttr.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute("position", posAttr);
        geometry.setDrawRange(0, 0);

        const material = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.02 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Camera Orbit (구면 좌표)
        const target = new THREE.Vector3(0, 0, 0);
        let radius = camera.position.distanceTo(target);
        let theta = Math.atan2(camera.position.y, camera.position.x);
        let phi = Math.acos(camera.position.z / radius);

        const updateCamera = () => {
            const sinPhi = Math.sin(phi);
            camera.position.set(
                target.x + radius * sinPhi * Math.cos(theta),
                target.y + radius * sinPhi * Math.sin(theta),
                target.z + radius * Math.cos(phi)
            );
            camera.lookAt(target);
        };
        updateCamera();

        // Mouse control
        let dragging = false;
        let lastX = 0;
        let lastY = 0;

        const onDown = (e) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        };
        const onUp = () => {
            dragging = false;
        };
        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            theta -= dx * 0.01;
            phi = Math.min(Math.PI - 0.05, Math.max(0.05, phi - dy * 0.01));
            updateCamera();
        };
        const onWheel = (e) => {
            e.preventDefault();
            radius *= 1 + Math.sign(e.deltaY) * 0.1;
            radius = Math.max(0.5, radius);
            updateCamera();
        };

        const dom = renderer.domElement;
        dom.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);
        dom.addEventListener("mousemove", onMove);
        dom.addEventListener("wheel", onWheel, { passive: false });

        // 최신 프레임을 지오메트리에 반영(rAF 틱마다 1회)
        const applyLatest = () => {
            if (!hasNewRef.current) return;
            hasNewRef.current = false;

            const frame = latestRef.current;
            if (!frame || !frame.points) return;

            const stride = frame.fields && frame.fields.length ? frame.fields.length : 3;
            const src = frame.points;
            const n = Math.floor(src.length / stride);

            // 필요 시에만 버퍼 확대(그 외엔 재사용)
            if (n > capacity) {
                capacity = n;
                posAttr = new THREE.BufferAttribute(new Float32Array(capacity * 3), 3);
                posAttr.setUsage(THREE.DynamicDrawUsage);
                geometry.setAttribute("position", posAttr);
            }

            const dst = geometry.attributes.position.array;
            for (let i = 0; i < n; i++) {
                const s = i * stride;
                const d = i * 3;
                dst[d] = src[s];
                dst[d + 1] = src[s + 1];
                dst[d + 2] = src[s + 2];
            }

            geometry.setDrawRange(0, n);
            geometry.attributes.position.needsUpdate = true;
        };

        // Render loop
        let raf;
        const renderLoop = () => {
            applyLatest();
            renderer.render(scene, camera);
            raf = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Resize: 컨테이너(100%) 크기에 정확히 맞춘다.
        // 창 리사이즈뿐 아니라 스플릿 패널 드래그 등 컨테이너 크기 변화도 반영하도록 ResizeObserver 사용.
        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (!w || !h) return; // 레이아웃 전(0)엔 스킵
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        // ResizeObserver 콜백 안에서 즉시 setSize하면
        // "ResizeObserver loop completed with undelivered notifications" 경고가 날 수 있어
        // 리사이즈 처리를 다음 프레임으로 미뤄 루프를 끊는다.
        let resizeRaf = 0;
        const scheduleResize = () => {
            cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(handleResize);
        };
        const ro = new ResizeObserver(scheduleResize);
        ro.observe(container);
        window.addEventListener("resize", handleResize);
        handleResize();

        // Cleanup
        return () => {
            cancelAnimationFrame(raf);
            cancelAnimationFrame(resizeRaf);
            ro.disconnect();
            window.removeEventListener("resize", handleResize);
            dom.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
            dom.removeEventListener("mousemove", onMove);
            dom.removeEventListener("wheel", onWheel);
            try {
                geometry.dispose();
                material.dispose();
                renderer.dispose();
            } catch {}
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, [topic]);

    // binaryStreamBus 구독: 최신 프레임만 보관(conflation). React state를 거치지 않음.
    useEffect(() => {
        if (!vehicleId || !topic) return undefined;
        const unsubscribe = subscribeBinary(vehicleId, topic, (value) => {
            latestRef.current = value;
            hasNewRef.current = true;
        });
        return unsubscribe;
    }, [vehicleId, topic]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        />
    );
}
