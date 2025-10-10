// 차량 추가 컴포넌트
import React, {useState} from 'react';
import {useLocation} from "react-router";

const AddVehicle = ({title, onCancel}) => {
    const [value, setValue] = useState("pre");
    const handleChange = (e) => setValue(e.target.value);
    const location = useLocation();

    return (
        <div className='setting-content'>
            <h2>{title}</h2>
            {location.pathname === '/group/setting' && (
                <div>
                    <p>Retrieve registered vehicle information
                        <select className='select-option' style={{marginLeft: '10px'}} id="whiteSpace" value={value} onChange={handleChange}>
                            <option>new</option>
                            <option>저장된 차량 이름</option>
                        </select></p>
                </div>
            )}
            <div className='setting-grid'>

                <div>
                    <h3>Name*</h3>
                    <input className='setting-input'/>
                    <h3>Administrator</h3>
                    <input className='setting-input'/>
                </div>
                <div>
                    <h3>MAC*
                        <button
                            className='setting-btn'
                            style={{marginLeft: '10px'}}
                        >Connection</button>
                    </h3>
                    <input className='setting-input'/>
                    <h3>Purpose of Operation</h3>
                    <input className='setting-input'/>
                </div>
            </div>
            <div className='setting-people-title'></div>
            <div className='setting-grid' style={{padding: '10px'}}>
                <div>
                    <h3>Vehicle Topic Information
                        <button
                            className='setting-btn'
                            style={{marginLeft: '10px'}}
                        >Add</button>
                    </h3>
                    <input className='setting-input' placeholder='Topic Name'/>
                    <input className='setting-input' placeholder='Topic'/>
                    <textarea
                        className="setting-input"
                        style={{height: "30vh", resize: "vertical" }}
                        disabled
                    />
                </div>
                <div>
                    <h3>Sensor Topic Information
                        <button
                            className='setting-btn'
                            style={{marginLeft: '10px'}}
                        >Add</button>
                    </h3>
                    <input className='setting-input' placeholder='Sensor Name'/>
                    <input className='setting-input' placeholder='Topic'/>
                    <textarea
                        className="setting-input"
                        style={{height: "30vh", resize: "vertical" }}
                        disabled
                    />
                </div>
            </div>

            <button className='register-btn'>Register</button>
            <button
                className='register-btn'
                style={{right: '150px'}}
                onClick={onCancel}
            >Cancel</button>
        </div>
    );
}

export default AddVehicle;