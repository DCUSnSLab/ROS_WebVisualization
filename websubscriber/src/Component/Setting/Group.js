import React, {useState} from "react";


function Group() {
    const [edit, setEdit] = useState(false);

    return (
        <div className='setting-content'>
            <button
                className='setting-btn'
                style={{float: 'right', marginRight: '10px'}}
                onClick={() => { setEdit((prev) => !prev)}}
            >{edit ? 'Save' : 'Edit'}</button>
            <h5>Name</h5>
            <input className='setting-input' disabled={!edit}/>
            <h5>Description</h5>
            <textarea
                className="setting-input"
                style={{ width: "70vw", height: "50vh", resize: "vertical" }}
                disabled={!edit}
            />
            <button className='unsubscribe-btn'>Delete</button>
        </div>
    );
}

export default Group;