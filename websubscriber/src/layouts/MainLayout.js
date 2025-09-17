import {FaAngleDown} from "react-icons/fa";
import React from "react";
import './MainLayout.css';

function MainLayout(){

    return(
        <header className='header-bar'>
            <div className='bar-title'>
                <p className='font' style={{ fontSize: "30px", marginLeft: "10px"}}>SCMS</p>
                <label className='dropdownLabel' for='dropdown'>
                    <div className='font'>아이디</div>
                    <FaAngleDown className='careIcon'/>
                </label>
            </div>

            <div className='content'>
                <ul>
                    <li>Setting</li>
                    <li>Group</li>
                    <li>Q&A</li>
                    <li>Logout</li>
                </ul>
            </div>
        </header>
    );
}

export default MainLayout;