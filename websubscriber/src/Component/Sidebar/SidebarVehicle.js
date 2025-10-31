// 사이드바 차량 상태 정보 출력 컴포넌트

import React, {useState} from "react";
import './SidebarTopicAndStatus.css'

function SidebarTopic({vehicles}) {
    const [hunterData, setHunterData] = useState(null);

    return(
        <div className='sidebar-bg'>
            <p>Status: 운영중</p>
            <p>Battery: 50%</p>
            <p>CPU/GPU/RAM: 10%/10%/10%</p>
            <p>Speed: 5m/s</p>
            <p> Control: Auto</p>
            <p>Temperature: 10%</p>
            <p>Data transfer speed: 10Mbps</p>
            <button className='more-btn'>More</button>
            <p>Color</p>
        </div>
    )
}

export default SidebarTopic;