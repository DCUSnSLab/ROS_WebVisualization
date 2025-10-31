// 메인 사이드바 차량 데이터 부분
// title: Vehicle Status, content: 안에 들어갈 관련 내용

import React, { useState } from "react";
import './Sidebar.css';
import SidebarVehicle from "../../Sidebar/SidebarVehicle";
import { FaMinus } from "react-icons/fa6";

const AccordionItem = ({ title, content, onRemove}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='siderbar'>
            <button
                className='siderbar-btn'
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{isOpen ? "▲" : "▼"}</span>
                {title}

                <FaMinus
                    style={{ marginLeft: 'auto', display: 'block' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                />
            </button>


            {isOpen && (
                <div className='siderbar-content'>
                    {content}
                </div>
            )}
        </div>
    );
};

export default function SidebarBottom({vehicles, removeVehicle}) {
    return (
        <div className='siderbar-scroll'>
            {vehicles.map((vehicles) => (
                <AccordionItem
                    key={vehicles.ip}
                    title={vehicles.name}
                    content={<SidebarVehicle vehicles={vehicles}/>}
                    onRemove={() => removeVehicle(vehicles.ip)}/>
            ))}
            {/*<button>sdf</button>*/}
        </div>
    );
}
