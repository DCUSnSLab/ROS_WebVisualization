import React from "react";
import '../../css/Setting.css';

function Vehicle() {
    return (
        <div className='setting-content'>
            <div style={{flexDirection: 'column'}}>
                <h5>Currently registered vehicles: 보유한 차량 수</h5>
                <button className='setting-btn'>+Add</button>
            </div>
            <h5>Name: 사용자 이름</h5>
            <h5>Email: 사용자 이메일</h5>
            <button
                className='unsubscribe-btn'
                style={{float: 'right', marginRight: '10px'}}
            >unsubscribe</button>
        </div>
    );
}

export default Vehicle;