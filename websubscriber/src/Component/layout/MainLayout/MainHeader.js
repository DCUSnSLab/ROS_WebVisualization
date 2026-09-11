import { FaBell } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import React, { useEffect, useRef, useState } from "react";
import Modal from "../../Modal/Modal";

const getBagLabel = (bag) => {
    if (typeof bag === "string") {
        return bag.split(/[\\/]/).filter(Boolean).pop() || bag;
    }
    return bag?.name || bag?.bag_name || bag?.path || bag?.bag_path || "Unnamed bag";
};

const getBagPath = (bag) => {
    if (typeof bag === "string") return bag;
    return bag?.path || bag?.bag_path || bag?.name || bag?.bag_name || "";
};

export default function MainHeader({
    name,
    dropdownContent,
    onAddVehicle,
    vehicleList,
    connectVehicle,
    viewMode = "real",
    requestBagList,
    openBag
}) {
    const containerRef = useRef(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userIP, setUserIP] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [bagModalOpen, setBagModalOpen] = useState(false);
    const [bagFiles, setBagFiles] = useState([]);
    const [selectedBagPath, setSelectedBagPath] = useState("");
    const [bagLoading, setBagLoading] = useState(false);
    const [bagOpening, setBagOpening] = useState(false);
    const [bagError, setBagError] = useState("");

    useEffect(() => {
        const handleOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setUserMenuOpen(false);
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, []);

    useEffect(() => {
        setSelectedVehicle("");
        setBagModalOpen(false);
        setBagFiles([]);
        setSelectedBagPath("");
        setBagError("");
    }, [viewMode]);

    const handleAddClick = () => {
        if (!userIP || !vehicleName) {
            alert("Please enter both IP and vehicle name.");
            return;
        }

        onAddVehicle(userIP, vehicleName);
        setUserIP("");
        setVehicleName("");
    };

    const normalizedVehicleList = (vehicleList || [])
        .map((vehicle) => {
            if (typeof vehicle === "string") {
                return { id: vehicle, label: vehicle };
            }

            if (vehicle && typeof vehicle === "object") {
                return {
                    id: vehicle.id ?? "",
                    label: vehicle.id ?? "",
                    isBag: Boolean(vehicle.is_bag ?? vehicle.isBag),
                };
            }

            return { id: "", label: "" };
        })
        .filter((vehicle) => vehicle.id)
        .filter((vehicle) => viewMode === "real" || !vehicle.isBag);

    const handleVehicleAction = async () => {
        if (!selectedVehicle) return;

        if (viewMode === "real") {
            connectVehicle?.(selectedVehicle);
            return;
        }

        setBagModalOpen(true);
        setBagFiles([]);
        setSelectedBagPath("");
        setBagError("");
        setBagLoading(true);
        try {
            const files = await requestBagList?.(selectedVehicle);
            setBagFiles(Array.isArray(files) ? files : []);
        } catch (error) {
            setBagError(error?.message || "Bag 목록을 불러오지 못했습니다.");
        } finally {
            setBagLoading(false);
        }
    };

    const handleOpenBag = async () => {
        if (!selectedVehicle || !selectedBagPath || bagOpening) return;

        setBagOpening(true);
        setBagError("");
        try {
            await openBag?.({
                vehicleId: selectedVehicle,
                bagPath: selectedBagPath,
            });
            setBagModalOpen(false);
        } catch (error) {
            setBagError(error?.message || "Bag 데이터를 실행하지 못했습니다.");
        } finally {
            setBagOpening(false);
        }
    };

    return (
        <header className="header-bar">
            <div className="header-contents">
                <div className="left-cluster">
                    <h2 className="font-title header-logo">SCMS</h2>

                    <select
                        className="vehicle-select"
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                    >
                        <option value="">차량 선택</option>
                        {normalizedVehicleList.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleVehicleAction}
                        className="vehicle-add-btn"
                        disabled={!selectedVehicle}
                    >
                        {viewMode === "bag" ? "Open" : "Connect"}
                    </button>
                </div>

                <div className="font-content header-actions" ref={containerRef}>
                    <div className="header-action-wrap">
                        <button
                            type="button"
                            className="header-user-button"
                            onClick={() => {
                                setUserMenuOpen((current) => !current);
                                setNotificationOpen(false);
                            }}
                            aria-expanded={userMenuOpen}
                            aria-haspopup="menu"
                        >
                            <span>{name}</span>
                            <SlArrowDown
                                aria-hidden="true"
                                style={{
                                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease",
                                }}
                            />
                        </button>
                        {userMenuOpen && (
                            <div className="dropdown-menu user-dropdown-menu" role="menu">
                                {dropdownContent}
                            </div>
                        )}
                    </div>

                    <div className="header-action-wrap">
                        <button
                            type="button"
                            className="header-icon-button"
                            onClick={() => {
                                setNotificationOpen((current) => !current);
                                setUserMenuOpen(false);
                            }}
                            aria-label="알림"
                            aria-expanded={notificationOpen}
                            aria-haspopup="dialog"
                        >
                            <FaBell aria-hidden="true" />
                        </button>
                        {notificationOpen && (
                            <div
                                className="dropdown-menu notification-dropdown-menu"
                                role="dialog"
                                aria-label="알림 목록"
                            />
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={bagModalOpen}
                onClose={() => !bagOpening && setBagModalOpen(false)}
            >
                <div className="bag-browser-modal">
                    <div className="bag-browser-header">
                        <div>
                            <h3>Bag 데이터 열기</h3>
                            <p>{selectedVehicle} · hardware_monitor/bag</p>
                        </div>
                        <button
                            type="button"
                            className="bag-browser-close"
                            onClick={() => setBagModalOpen(false)}
                            disabled={bagOpening}
                            aria-label="닫기"
                        >
                            ×
                        </button>
                    </div>

                    <div className="bag-browser-list" role="radiogroup" aria-label="Bag 데이터 목록">
                        {bagLoading && <p className="bag-browser-empty">목록을 불러오는 중입니다.</p>}
                        {!bagLoading && bagFiles.length === 0 && !bagError && (
                            <p className="bag-browser-empty">실행할 수 있는 bag 데이터가 없습니다.</p>
                        )}
                        {!bagLoading && bagFiles.map((bag, index) => {
                            const path = getBagPath(bag);
                            const label = getBagLabel(bag);
                            return (
                                <label
                                    className={`bag-browser-item ${selectedBagPath === path ? "selected" : ""}`}
                                    key={`${path}-${index}`}
                                >
                                    <input
                                        type="radio"
                                        name="bag-file"
                                        value={path}
                                        checked={selectedBagPath === path}
                                        onChange={() => setSelectedBagPath(path)}
                                    />
                                    <span className="bag-browser-name">{label}</span>
                                    {typeof bag === "object" && bag?.duration != null && (
                                        <span className="bag-browser-meta">{bag.duration}s</span>
                                    )}
                                </label>
                            );
                        })}
                    </div>

                    {bagError && <div className="bag-browser-error" role="alert">{bagError}</div>}

                    <div className="bag-browser-actions">
                        <button
                            type="button"
                            className="bag-browser-cancel"
                            onClick={() => setBagModalOpen(false)}
                            disabled={bagOpening}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className="bag-browser-open"
                            onClick={handleOpenBag}
                            disabled={!selectedBagPath || bagOpening}
                        >
                            {bagOpening ? "실행 중..." : "실행"}
                        </button>
                    </div>
                </div>
            </Modal>
        </header>
    );
}
