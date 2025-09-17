import React from "react";
import './Loginout.css';

function SignUp(){
    return(
        <div className='background'>
            <div className='vertical-box'>
                <h1 className='font-title'>Sign up</h1>
                <p className='font-content'>ID</p>
                <input className='input'/>
                <p className='font-content'>Password</p>
                <input className='input'/>
                <p className='font-content'>Re-enter password</p>
                <input className='input'/>
                <p className='font-content'>Name</p>
                <input className='input'/>
                <p className='font-content'>E-mail</p>
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

export default SignUp;