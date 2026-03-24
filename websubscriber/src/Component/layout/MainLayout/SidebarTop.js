import React, { useState } from "react";
import "./Sidebar.css";
import SidebarTopic from "../../Sidebar/SidebarTopic";
// import vehicle from "../../Setting/Vehicle";

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="siderbar">
            <button className="siderbar-btn" onClick={() => setIsOpen(!isOpen)} style={{ justifyContent: "space-between" }}>
                {title}
                <span>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && <div className="siderbar-content">{content}</div>}
        </div>
    );
};

export default function SidebarTop({
                                       vehiclesData,
                                       onPanelSelect,
                                       activePanelsByTopic,
                                       connectVehicle
                                   }) {
    return (
        <div className="siderbar-scroll">
            {Object.keys(vehiclesData).map((vehicleId) => (
                <AccordionItem
                    key={vehicleId}
                    title={vehicleId}
                    content={
                        <SidebarTopic
                            vehicleList={[vehicleId]}
                            vehiclesData={vehiclesData}
                            onPanelSelect={onPanelSelect}
                            activePanelsByTopic={activePanelsByTopic}
                            connectVehicle={connectVehicle}
                        />
                    }
                />
            ))}
        </div>
    );
}

