// 그룹 회원 정보 확인 컴포넌트
import React from "react";

function People() {
    return (
        <div className='setting-content'
        style={{padding: '10px'}}>
            <button className='setting-btn'
                    style={{float: 'right', marginRight: '10px'}}
            >Invite</button>
            <h5 className='setting-people-title'>Leader</h5>
            <h5 className='setting-people-content'>리더 이름</h5>
            <h5 className='setting-people-title'>Administrator</h5>
            <h5 className='setting-people-content'>차량 관리자 이름</h5>
            <h5 className='setting-people-title'>User</h5>
            <h5 className='setting-people-content'>유저 이름</h5>
        </div>
    );
}

export default People;