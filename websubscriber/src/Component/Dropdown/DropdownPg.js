// 개인 페이지 드롭다운

import React, {useState} from "react";
import './Dropdown.css';
import Modal from '../Modal/Modal';
import { Route, Link } from 'react-router-dom';

function DropdownPg() {
    const [open, setOpen] = useState(false);

    return (
        <div className='drop-pg'>
            <Link to="/setting" className="drop-link">Setting</Link>
            <Link onClick={() => setOpen(true)} className="drop-link">Group</Link>
            <Link to="/qna" className="drop-link">Q&A</Link>
            <Link to="/" className="drop-link">Logout</Link>

            <Modal isOpen={open} onClose={() => setOpen(true)}>
                <div>
                    <p>이 항목을 삭제하시겠습니까?</p>
                    <div>
                        <button>삭제</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default DropdownPg;