// 메인화면 상단 헤더 컴포넌트
// name: 사용자 이름, dropdownContent: 드롭다운 클릭 시 나오는 컴포넌트

import { FaBell } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    dropdownContent?: React.ReactNode;
    name?: React.ReactNode;
    onAddVehicle: (ip: string, name: string) => void;
    vehicleList: string[];
    connectVehicle: (vid: string) => void;
};

const MainHeader: React.FC<Props> = ({ name, dropdownContent, onAddVehicle, vehicleList, connectVehicle}) => {
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
            alert("IP와 Vehicle Name을 모두 입력하세요.");
            return;
        }

        onAddVehicle(userIP, vehicleName);

        setUserIP("");
        setVehicleName("");
    };

    return (
        <header className="header-bar">
            <div className="header-contents">

                {/* 왼쪽 영역: 로고 + 차량추가 */}
                <div className="left-cluster">
                    <h2 className="font-title header-logo">SCMS</h2>

                    <select
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                    >
                        <option value="">차량 선택</option>
                        {vehicleList.map((vid) => (
                            <option key={vid} value={vid}>
                                {vid}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => connectVehicle(selectedVehicle)} className="vehicle-add-btn">Connect</button>
                </div>

                {/* 오른쪽 영역: 유저/알림 */}
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
};

export default MainHeader;
