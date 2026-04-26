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
                                       subscribeTopic
                                     }) {
    const connectedVehicles = Object.entries(vehiclesData || {}).filter(
        ([, vehicleData]) =>
            vehicleData &&
            Object.prototype.hasOwnProperty.call(vehicleData, "topics")
    );

    return (
        <div className="siderbar-scroll">
            {connectedVehicles.map(([vehicleId]) => (
                <AccordionItem
                    key={vehicleId}
                    title={vehicleId}
                    content={
                        <SidebarTopic
                            vehicleList={[vehicleId]}
                            vehiclesData={vehiclesData}
                            onPanelSelect={onPanelSelect}
                            activePanelsByTopic={activePanelsByTopic}
                            subscribeTopic={subscribeTopic}
                        />
                    }
                />
            ))}
        </div>
    );
}

