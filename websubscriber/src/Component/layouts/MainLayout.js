// 메인 화면 레이아웃
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
                    <div className='side-bar-grid'>
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


                        </aside>
                        <aside className='side-bar-vehicle'>
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
                    </div>

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