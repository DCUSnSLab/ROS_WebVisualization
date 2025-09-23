// 아이디 조회 페이지

import React from "react";
import '../css/Loginout.css';

function ID(){
    return(
        <div className='background'>
            <div className='vertical-box'>
                <h1 className='font-title' style={{fontSize: '30px'}}>Forget your ID?</h1>
                <p className='font-content'>Name</p>
                <input className='input'/>
                <p className='font-content'>Enter Email Address</p>
                <div>
                    <input className='input' style={{width: '415px'}}/>
                    <button className='button-send'>Send</button>
                </div>
                <p className='font-content'>Enter verification code</p>
                <div>
                    <input className='input' style={{width: '415px'}}/>
                    <button className='button-send'>Confirmation</button>
                </div>
                <button className='button'>Continue</button>
            </div>
        </div>
    );
}

export default ID;