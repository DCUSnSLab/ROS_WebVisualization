// 메인 화면 레이아웃
//name: 사용자 이름, dropdownContent: 드롭다운 클릭 시 나오는 컴포넌트, content: 사이드바에 표시할 컴포넌트

import React, {useState} from "react";
import './MainLayout.css';
import Header from './MainHeader';
import Footer from './MainFooter';
import SidebarTop from "./SidebarTop";
import SidebarBottom from "./SidebarBottom";
import DataSpace from "../DataViewerLayout/DataSpace";
import UseRosVehicles from "./UseRosVehicles";

const MainLayout: React.FC<Props> = ({name, dropdownContent, content}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenVehicle, setIsOpenVehicle] = useState(true);
    const [vehicles, setVehicles] = useState([]);

    const vehiclesData = UseRosVehicles(vehicles);

    const addVehicle = (rawIP, vehicleName) => {
        if(!rawIP || !vehicleName) return;
        const vehicleIP = `ws://${rawIP}:9090`;
        setVehicles((prev) => {
            if (prev.some((v) => v.ip === vehicleIP)) {
                return prev;
            }
            return [...prev, {ip: vehicleIP, name: vehicleName}];
        });
    };

    const removeVehicle = (ip: string) => {
        setVehicles((prev) => prev.filter((v) => v.ip !== ip));
    };


    return (
        <div className='layout'>
            <Header
                name={name}
                dropdownContent={dropdownContent}
                onAddVehicle={addVehicle}
            />
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
                        {isOpen && (content || <SidebarTop
                            vehiclesData={vehiclesData}
                            vehicles={vehicles}/>)}
                        <button
                            className='side-btn'
                            onClick={() => setIsOpenVehicle(!isOpenVehicle)}
                        >
                            <span>{isOpenVehicle ? "▲ " : "▼ "}</span>
                            Vehicle Status
                        </button>
                        <div className='side-title'></div>
                        {isOpenVehicle && (content || <SidebarBottom
                            vehicles={vehicles}
                            vehiclesData={vehiclesData}
                            removeVehicle={removeVehicle}/>)}
                    </aside>
                    <section>
                        <DataSpace
                            vehicles={vehicles}
                            vehiclesData={vehiclesData}
                        />
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;