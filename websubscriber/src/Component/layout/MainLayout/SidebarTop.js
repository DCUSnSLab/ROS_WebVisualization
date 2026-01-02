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
                                       onTopicSelect,
                                       onPanelSelect,
                                       selectedTopic,
                                       selectedPanel,
                                   }) {
    return (
        <div className="siderbar-scroll">
            <AccordionItem
                title={(vehicles && vehicles.length > 0 && vehicles[0]?.name) || "Vehicle"}
                content={
                    <SidebarTopic
                        vehicles={vehicles}
                        vehiclesData={vehiclesData}
                        onTopicSelect={onTopicSelect}
                        onPanelSelect={onPanelSelect}
                        selectedTopic={selectedTopic}
                        selectedPanel={selectedPanel}
                    />
                }
            />
        </div>
    );
}

