// 사이드바 토픽 정보 출력 컴포넌트

import React, {useState} from "react";
import './SidebarTopicAndStatus.css'

function SidebarTopic() {
    return(
        <div className='sidebar-bg'>
            <p className='topic-name'>토픽명</p>
            <div>
                {/*<button className='sidebar-btn' style={{background: '#D3D3D3'}} >Map x</button>*/}
                <button className='sidebar-btn'>+Add</button>
            </div>
        </div>
    )
}

export default SidebarTopic;