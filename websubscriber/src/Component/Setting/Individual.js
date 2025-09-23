import React, { useState } from 'react';
import '../../css/Setting.css';

function Individual() {
    return (
        <div className='setting-content'>
            <button className='setting-btn' style={{float: 'right', marginRight: '10px'}}>Edit</button>
            <h5>ID: 사용자 아이디</h5>
            <h5>Name: 사용자 이름</h5>
            <h5>Email: 사용자 이메일</h5>
            <button className='unsubscribe-btn'>unsubscribe</button>
        </div>
    );
}

export default Individual;