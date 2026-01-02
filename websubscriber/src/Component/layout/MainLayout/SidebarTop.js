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
                                       vehicles,
                                       vehiclesData,
                                       onPanelSelect,
                                       activePanelsByTopic,
                                   }) {
    return (
        <div className="siderbar-scroll">
            {vehicles.map((vehicle) => (
                <AccordionItem
                    key={vehicle.ip}
                    title={vehicle.name || "Vehicle"}
                    content={
                        <SidebarTopic
                            vehicles={[vehicle]}
                            vehiclesData={vehiclesData}
                            onPanelSelect={onPanelSelect}
                            activePanelsByTopic={activePanelsByTopic}
                        />
                    }
                />
            ))}
        </div>
    );
}

