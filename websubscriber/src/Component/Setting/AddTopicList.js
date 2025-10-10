import React from "react";

function AddTopicList() {
    return (
        <div className='setting-content'>
            <h2>Logging Topic List
                <button className='setting-btn'
                    style={{marginLeft: '10px'}}
                >Create</button>
            </h2>
            <div className='setting-grid'>
                <div style={{marginTop: '30px'}}>
                    <h3>Name</h3>
                    <input className='setting-input'/>
                    <div style={{marginTop: '0.5vw'}}>
                        <h3>Topics to logging</h3>
                        <input className='setting-input'/>
                        <h3>Topic Message</h3>
                        <input className='setting-input'/>
                    </div>
                    <button
                        className='setting-btn'
                        style={{width: '30vw', marginTop: '2vw'}}
                    >Add Topic</button>
                </div>
                <div>
                    <h3>Selected Topic</h3>
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