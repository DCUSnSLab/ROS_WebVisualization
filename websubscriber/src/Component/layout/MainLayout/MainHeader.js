import { FaBell } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import React, { useEffect, useRef, useState } from "react";

export default function MainHeader({
    name,
    dropdownContent,
    onAddVehicle,
    vehicleList,
    connectVehicle
}) {
    const containerRef = useRef(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userIP, setUserIP] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");

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
                };
            }

            return { id: "", label: "" };
        })
        .filter((vehicle) => vehicle.id);

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
                        onClick={() => connectVehicle(selectedVehicle)}
                        className="vehicle-add-btn"
                        disabled={!selectedVehicle}
                    >
                        Connect
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
        </header>
    );
}
