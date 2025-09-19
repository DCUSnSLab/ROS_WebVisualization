// 메인화면 상단 헤더 컴포넌트
import { FaBell } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";
import React from "react";

type Props = {
    dropdownContent?: React.ReactNode;
    name?: React.ReactNode;
};

const MainHeader: React.FC<Props> = ({ name, dropdownContent }) => {
    const [view, setView] = useState(false);

    return (
        <header className="header-bar">
            <div className="header-contents">
                <h2 className="font-title" style={{ fontSize: "25px" }}>
                    SCMS
                </h2>

                <nav className="font-content">
                    <ul onClick={() => setView(!view)} style={{ cursor: "pointer" }}>
                        {name}{" "}
                        <SlArrowDown
                            style={{
                                transform: view ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                            }}
                        />
                        {view && <div>{dropdownContent}</div>}
                    </ul>
                    <li style={{ marginLeft: "20px" }}>
                        <FaBell />
                    </li>
                </nav>
            </div>
        </header>
    );
};

export default MainHeader;
