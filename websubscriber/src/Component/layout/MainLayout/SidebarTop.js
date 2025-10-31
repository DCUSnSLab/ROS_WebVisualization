// 메인 사이드바 차량 센사 데이터 부분
// title: Topic, content: 안에 들어갈 관련 내용

import React, { useState } from "react";
import './Sidebar.css';
import SidebarTopic from '../../Sidebar/SidebarTopic';

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='siderbar'>
            <button
                className='siderbar-btn'
                style={{justifyContent: 'space-between'}}
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
            <AccordionItem title="Bookmarks" content={<SidebarTopic/>}/>
            <AccordionItem title="Using" content={<SidebarTopic/>}/>
            <AccordionItem title="All" content={<SidebarTopic/>}/>
        </div>
    );
}
