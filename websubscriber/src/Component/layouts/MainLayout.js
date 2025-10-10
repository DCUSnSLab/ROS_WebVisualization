// 메인 화면 레이아웃
//children: 센서 데이터가 나오는 공간, name: 사용자 이름, dropdownContent: 드롭다운 클릭 시 나오는 컴포넌트, content: 사이드바에 표시할 컴포넌트

import React, {useState} from "react";
import '../../css/MainLayout.css';
import Header from './MainHeader';
import Footer from './MainFooter';
import SidebarTop from "./SidebarTop";
import SidebarBottom from "./SidebarBottom";

const MainLayout: React.FC<Props> = ({children, name, dropdownContent, content}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenVehicle, setIsOpenVehicle] = useState(true);

    return (
        <div className='layout'>
            <Header name={name} dropdownContent={dropdownContent}/>
            <main className='main'>
                <div className='main-grid'>
                    <aside className='side-bar-topic'>
                        <button
                            className='side-btn'
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span>{isOpen ? "▲ " : "▼ "}</span>
                            Topic
                        </button>
                        <div className='side-title'></div>
                        {isOpen && (content || <SidebarTop />)}
                        <button
                            className='side-btn'
                            onClick={() => setIsOpenVehicle(!isOpenVehicle)}
                        >
                            <span>{isOpenVehicle ? "▲ " : "▼ "}</span>
                            Vehicle Status
                        </button>
                        <div className='side-title'></div>
                        {isOpenVehicle && (content || <SidebarBottom />)}
                    </aside>
                    <section className='content'>
                        {children}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;