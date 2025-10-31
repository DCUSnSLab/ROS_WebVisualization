// 그룹 페이지 드롭다운

import React from "react";
import './Dropdown.css';
import {Link} from "react-router-dom";

function DropdownPgGroup() {

    return (
        <div className='drop-pg'>
            <Link to="/group/setting" className="drop-link">Setting</Link>
            <Link to="/main" className="drop-link">Logout</Link>
        </div>
    );
}

export default DropdownPgGroup;