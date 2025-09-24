// 로깅 토픽 데이터 확인 컴포넌트
import React, { useState } from 'react';
import '../../css/Setting.css';
import AddTopicList from "./AddTopicList";

function LoggingTopic() {
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState("pre");
    const [page, setPage] = useState('setting');

    const handleChange = (e) => setValue(e.target.value);

    if (page === "add") {
        return <AddTopicList onCancel={() => setPage("setting")}/>;
    }

    return (
        <div className='setting-content'>
            <button
                className='setting-btn'
                style={{float: 'right', marginRight: '10px'}}
                onClick={() => setPage('add')}
            >Add</button>
            <h5>Logging Topic List</h5>
            <select className='select-option' id="whiteSpace" value={value} onChange={handleChange}>
                <option>Topic List 이름</option>
            </select>
            <button
                className='setting-btn'
                style={{marginLeft: '10px'}}
                onClick={() => { setEdit((prev) => !prev)}}
            >{edit ? 'Save' : 'Edit'}</button>
            <div >
                <textarea
                    className="setting-input"
                    style={{ width: "90vw", height: "70vh", marginTop: '20px'}}
                    disabled={!edit}
                />
            </div>
        </div>
    );
}

export default LoggingTopic;