// 메인화면 상단 헤더 컴포넌트
// name: 사용자 이름, dropdownContent: 드롭다운 클릭 시 나오는 컴포넌트

import { FaBell } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    dropdownContent?: React.ReactNode;
    name?: React.ReactNode;
    onAddVehicle: (ip: string, name: string) => void;
};

const MainHeader: React.FC<Props> = ({ name, dropdownContent, onAddVehicle}) => {
    const containerRef = useRef(null);
    const [view, setView] = useState(false);
    const [userIP, setUserIP] = useState("");
    const [vehicleName, setVehicleName] = useState("");

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

                    <div className="add-vehicle">
                        <input
                            type="text"
                            placeholder="IP:Port"
                            className="vehicle-input"
                            value={userIP}
                            onChange={(e) => setUserIP(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Vehicle Name"
                            className="vehicle-input"
                            value={vehicleName}
                            onChange={(e) => setVehicleName(e.target.value)}
                        />
                        <button onClick={handleAddClick} className="vehicle-add-btn">Add</button>
                    </div>
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
