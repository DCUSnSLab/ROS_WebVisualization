// 개인정보 설정 컴포넌트
import React, { useState } from 'react';
import '../../css/Setting.css';

function Individual() {
    const [edit, setEdit] = useState(false);

    return (
        <div className='setting-content'>
            <button
                className='setting-btn'
                style={{float: 'right', marginRight: '10px'}}
                onClick={() => { setEdit((prev) => !prev)}}
            >{edit ? 'Save' : 'Edit'}</button>
            <h5>ID</h5>
            <input className='setting-input' disabled/>
            <h5>Name</h5>
            <input className='setting-input' disabled={!edit}/>
            <h5>Email</h5>
            <input className='setting-input' disabled={!edit}/>
            <button className='unsubscribe-btn'>Delete</button>
        </div>
    );
}

export default Individual;