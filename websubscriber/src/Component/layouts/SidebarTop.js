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

export default function SidebarTop() {
    return (
        <div className='siderbar-scroll'>
            <AccordionItem title="Bookmarks" content="북마크" />
            <AccordionItem title="Using" content="사용 중 토픽" />
            <AccordionItem title="All" content={"전체 토픽"} />
        </div>
    );
}
