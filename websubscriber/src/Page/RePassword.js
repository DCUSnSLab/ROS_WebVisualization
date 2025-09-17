import React from "react";
import './Loginout.css';
import {useNavigate} from "react-router-dom";

function RePassword(){
    const navigate = useNavigate();

    const handleClickLogin = () => {
        navigate('/login');
    };

    return(
        <div className='background'>
            <div className='vertical-box'>
                <h1 className='font-title' style={{fontSize: '30px'}}>Change your password</h1>
                <p className='font-content'>Password</p>
                <input className='input'/>
                <p className='font-content'>Re-enter password</p>
                <input className='input'/>
                <button className='button' onClick={handleClickLogin}>Continue</button>
            </div>
        </div>
    );
}

// 비밀번호가 변경되었습니다. 팝업창 추가

export default RePassword;