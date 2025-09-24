// 차량 정보 확인 컴포넌트
import React, {useState} from "react";
import '../../css/Setting.css';
import AddVehicle from './AddVehicle';

const Vehicle = ({vehicleText, title}) => {
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState("pre");
    const [page, setPage] = useState('setting');

    const handleChange = (e) => setValue(e.target.value);

    if (page === "add") {
        return <AddVehicle title={title} onCancel={() => setPage("setting")}/>;
    }

    return (
        <div className='setting-content'>
            <button className='setting-btn' style={{float: 'right', marginRight: '10px'}} onClick={() => setPage('add')}>+Add</button>
            <h5>Currently registered vehicles: 현재 차량 수 </h5>
            <select className='select-option' id="whiteSpace" value={value} onChange={handleChange}>
                <option>저장된 차량 이름</option>
            </select>
            <button
                className='setting-btn'
                onClick={() => { setEdit((prev) => !prev)}}
            >{edit ? 'Save' : 'Edit'}</button>
            <div className='setting-grid'>
                <div>
                    <h5>MAC</h5>
                    <input className='setting-input' disabled/>
                    <h5>Purpose of Operation</h5>
                    <input className='setting-input' disabled={!edit}/>
                    <h5>{vehicleText}</h5>
                    <input className='setting-input' disabled={!edit}/>
                </div>
                <div>
                    <h5>Vehicle Topic Information</h5>
                    <input
                        className='setting-input'
                        style={{height: '10vw'}}
                        disabled={!edit}/>
                    <h5>Sensor Topic Information</h5>
                    <input
                        className='setting-input'
                        style={{height: '10vw'}}
                        disabled={!edit}/>
                </div>
            </div>

            {page === "add" && <AddVehicle />}
        </div>
    );
}

export default Vehicle;

