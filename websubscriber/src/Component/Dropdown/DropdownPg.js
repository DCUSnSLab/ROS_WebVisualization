// 개인 페이지 드롭다운
import React, { useState } from "react";
import "./Dropdown.css";
import Modal from "../Modal/Modal";
import {Link, useNavigate} from "react-router-dom";

function DropdownPg() {
    const [open, setOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const navigate = useNavigate();

    const goGroupMain = () => navigate("/group/main");

    return (
        <div className="drop-pg" onClick={(e) => e.stopPropagation()}>
            <Link to="/setting" className="drop-link">Setting</Link>

            <button
                type="button"
                className="drop-link"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                }}
            >Group
            </button>

            <Link to="/dashboard" className="drop-link">Dashboard</Link>
            <Link to="/" className="drop-link">Logout</Link>

            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <h3 className='modal-title'>Group List
                    <button className='modal-btn' style={{float: 'right', fontSize: '20px'}}
                    onClick={(e) => {
                        e.stopPropagation();
                        setCreateOpen(true);
                    }}>+Create</button>
                </h3>
                <div className='modal-content'>
                    <p className='modal-text'>생성된 그룹명</p>
                    <button className='modal-btn' onClick={goGroupMain}>Enter</button>
                </div>
            </Modal>

            <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
                <h3 className='modal-title'>Group Creation
                    <button className='modal-btn' style={{float: 'right', fontSize: '20px'}}
                            onClick={goGroupMain}
                            >Create</button>
                </h3>
                <div className='modal-content'>
                    <div className='modal-group'>
                        <h2>name*</h2>
                        <input className='input'/>
                        <h2>Description</h2>
                        <textarea className='input-desc'/>
                    </div>


                </div>
            </Modal>
        </div>
    );
}

export default DropdownPg;
