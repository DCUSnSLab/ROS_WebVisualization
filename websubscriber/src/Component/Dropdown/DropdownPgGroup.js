// 그룹 페이지 드롭다운

import React from "react";
import './Dropdown.css';

function DropdownPgGroup() {

    return (
        <div className='drop-pg'>
            <a href="/group/setting" className="drop-link">Setting</a>
            <a href="/main" className="drop-link">Logout</a>
        </div>
    );
}

export default DropdownPgGroup;