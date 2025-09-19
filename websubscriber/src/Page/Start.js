// 시작페이지
import React from "react";
import './Loginout.css';
import {useNavigate} from "react-router-dom";

function Start() {
    const navigate = useNavigate();

    function startClick() {
        navigate('/login');
    }

    return(
        <div className='background'>
            <div className='vertical-box'>
                <h1 className='font-title'>Snslab Control Monitoring System</h1>
                <button onClick={startClick} className='start-btn'>Start</button>
            </div>

        </div>
    );
}

export default Start;