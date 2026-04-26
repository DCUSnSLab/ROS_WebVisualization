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
    const [view, setView] = useState(false);
    const [userIP, setUserIP] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");

    useEffect(() => {
        const handleOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setView(false);
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
                    >
                        Connect
                    </button>
                </div>

                <div className="font-content" ref={containerRef}>
                    <ul
                        onClick={() => setView(!view)}
                        style={{ cursor: "pointer" }}
                    >
                        {name}{" "}
                        <SlArrowDown
                            style={{
                                transform: view ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                            }}
                        />
                        {view && <div className="dropdown-menu">{dropdownContent}</div>}
                    </ul>

                    <li style={{ marginLeft: "20px" }}>
                        <FaBell />
                    </li>
                </div>
            </div>
        </header>
    );
}
