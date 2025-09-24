import React from "react";

function AddTopicList() {
    return (
        <div className='setting-content'>
            <h5>Logging Topic List
                <button className='setting-btn'
                    style={{marginLeft: '10px'}}
                >Create</button>
            </h5>
            <div className='setting-grid'>
                <div>
                    <h5>Name</h5>
                    <input className='setting-input'/>
                    <div style={{marginTop: '1vw'}}>
                        <h5>Topics to logging</h5>
                        <input className='setting-input'/>
                        <h5>Topic Message</h5>
                        <input className='setting-input'/>
                    </div>
                    <button
                        className='setting-btn'
                        style={{width: '30vw', marginTop: '2vw'}}
                    >Add Topic</button>
                </div>
                <div>
                    <h5>Selected Topic</h5>
                    <textarea
                        className="setting-input"
                        style={{ width: "60vw", height: "70vh"}}
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}

export default AddTopicList;