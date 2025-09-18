// 조회한 아이디 확인하는 페이지

import React from "react";
import './Loginout.css';
import {useNavigate} from "react-router-dom";

function CheckID(){
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate('/login');
    };

    const handleClickRePassword = () => {
        navigate('/view_password');
    }

    return(
        <div className='background'>
            <div className='vertical-box'>
                <h1 className='font-title' style={{fontSize: '30px'}}>Forget your ID?</h1>
                <div className= 'id-box'>
                    <p className='font-content'>아이디 출력 공간</p>
                </div>
                <div>
                    <button className='button' style={{width: '180px'}} onClick={handleClickLogin}>Login</button>
                    <button className='button' style={{width: '180px'}} onClick={handleClickRePassword}>Password Reset</button>
                </div>
            </div>
        </div>
    );
}

export default CheckID;