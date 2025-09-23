import React, { useState } from 'react';
import '../../css/Setting.css'
import {Link} from "react-router-dom";

const SettingTab = ({ tab1Name, tab2Name, tab3Name, tab1, tab2, tab3, exit }) => {
    const tabs = [
        { label: tab1Name, panel: tab1 },
        { label: tab2Name, panel: tab2 },
        { label: tab3Name, panel: tab3 },
    ].filter(t => t.label != null);

    const [activeTab, setActiveTab] = useState(0);

    if (tabs.length === 0) return null;

    return (
        <div>
            <div className='tab-top'>
                <h2>Setting</h2>
                <Link to={exit} className='tab-exit'> X </Link>
            </div>
            <div className={'tab'}>
                {tabs.map((t, index) => (
                    <button className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                        key={index}
                        onClick={() => setActiveTab(index)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div style={{ marginTop: 20, marginLeft: 20 }}>
                {tabs[activeTab]?.panel}
            </div>
        </div>
    );
};

export default SettingTab;
