// 메인화면 하단 푸터 컴포넌트
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import './MainLayout.css';
import React, {useState} from "react";
import Modal from "../../Modal/Modal";
import '../../Modal/Modal.css';

function MainFooter(){
    const [open, setOpen] = useState(false);
    const [logging, setLogging] = useState(false);
    const [value, setValue] = useState("pre");

    const handleChange = (e) => setValue(e.target.value);

    const handleStart = () => {
        setLogging(true);
        setOpen(false);
    };

    return(
        <footer className='footer-bar'>
            <div className='footer-button'>
                <div className='footer-contents'>
                    <p>재생 바 들어길 자리</p>
                    <div className='footer-play'>
                        <IoPlaySkipBackSharp style={{color: 'white'}} />
                        <FaPlay style={{color: 'white', marginLeft: '15px'}}/>
                        <IoPlaySkipForward style={{color: 'white', marginLeft: '15px'}}/>
                    </div>
                </div>
                <button
                    type='button'
                    className='logging-btn'
                    onClick={(e) => {
                        e.stopPropagation();
                        if (logging) {
                            setLogging(false);
                        }
                        else {
                            setOpen(true);
                        }
                    }}
                >{logging ? "Logging Stop" : "Logiging"}
                </button>

                <Modal isOpen={open} onClose={() => setOpen(false)}>
                    <h3 className='modal-title'>Select Logging Topic
                        <button
                            className='modal-btn'
                            style={{float: 'right', fontSize: '20px'}}
                            onClick={handleStart}
                        >Start</button>
                    </h3>
                    <div className='modal-content'>
                        <div>
                            <select className='select-option' id="whiteSpace" value={value} onChange={handleChange}>
                                <option>Topic List 이름</option>
                            </select>
                        </div>

                    </div>
                    <textarea
                        className="setting-input"
                        style={{width: "95%", height: "60%", marginLeft: '20px'}}
                        disabled
                    />
                </Modal>
            </div>
        </footer>
    );
}

export default MainFooter;



