import React, { useState } from "react";
import '../../css/Sidebar.css';

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='siderbar'>
            <button
                className='siderbar-btn'
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <span>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className='siderbar-content'>
                    {content}
                </div>
            )}
        </div>
    );
};

export default function SidebarBottom() {
    return (
        <div className='siderbar-scroll'>
            <AccordionItem title="차량 이름" content="차량 데이터" />

        </div>
    );
}
