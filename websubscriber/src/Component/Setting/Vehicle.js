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
            <h3>Currently registered vehicles: 현재 차량 수 </h3>
            <select className='select-option' id="whiteSpace" value={value} onChange={handleChange}>
                <option>저장된 차량 이름</option>
            </select>
            <button
                className='setting-btn'
                style={{marginLeft: '10px'}}
                onClick={() => { setEdit((prev) => !prev)}}
            >{edit ? 'Save' : 'Edit'}</button>
            <div className='setting-grid'>
                <div style={{marginTop: '20px'}}>
                    <h3>MAC</h3>
                    <input className='setting-input' disabled/>
                    <h3>Purpose of Operation</h3>
                    <input className='setting-input' disabled={!edit}/>
                    <h3>{vehicleText}</h3>
                    <input className='setting-input' disabled={!edit}/>
                </div>
                <div>
                    <h3>Vehicle Topic Information</h3>
                    <input
                        className='setting-input'
                        style={{height: '10vw'}}
                        disabled={!edit}/>
                    <h3>Sensor Topic Information</h3>
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

