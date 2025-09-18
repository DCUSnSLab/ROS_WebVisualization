// 로그인 페이지

import React from "react";
import { Link } from "react-router-dom";
import './Loginout.css';

function Login(){
    return(
        <div className='background'>
            <div className='vertical-box'>
                <h1 className='font-title' style={{alignSelf: 'flex-start'}}>SCMS</h1>
                <input className='input' placeholder='ID'/>
                <input className='input' placeholder='Password'/>
                <button className='button'>Login</button>

                <p className='forgot-text'>
                    Forgot your{" "}
                    <Link to='/view_password' className='link'>
                        Password
                    </Link>{" "}
                    or{" "}
                    <Link to='/find_id' className='link'>
                        ID
                    </Link>
                    ? | {" "}
                    <Link to='/sign_up' className='link'>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;