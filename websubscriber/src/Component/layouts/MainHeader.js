// 메인화면 상단 헤더 컴포넌트
import { FaBell } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import {useEffect, useRef, useState} from "react";
import React from "react";

type Props = {
    dropdownContent?: React.ReactNode;
    name?: React.ReactNode;
};

const MainHeader: React.FC<Props> = ({ name, dropdownContent }) => {
    const [view, setView] = useState(false);
    const containerRef = useRef(null)

    useEffect(() => {
        const handleOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setView(false);
            }
        };

        document.addEventListener('mousedown', handleOutside);

        return () => {
            document.removeEventListener('mousedown', handleOutside);
        }
    }, []);

    return (
        <header className="header-bar">
            <div className="header-contents">
                <h2 className="font-title" style={{ fontSize: "25px" }}>
                    SCMS
                </h2>

                <div className="font-content" ref={containerRef}>
                    <ul onClick={() => setView(!view)} style={{ cursor: "pointer"}}>
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
                </div>
            </div>
        </header>
    );
};

export default MainHeader;
