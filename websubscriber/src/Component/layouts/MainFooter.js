// 메인화면 하단 푸터 컴포넌트
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import '../../css/MainLayout.css';
import React, {useState} from "react";
import Modal from "../Modal/Modal";
import '../../css/Modal.css';

function MainFooter(){
    const [open, setOpen] = useState(false);

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
                        setOpen(true);
                    }}
                >Logiging
                </button>

                <Modal isOpen={open} onClose={() => setOpen(false)}>
                    <h3 className='modal-title'>Select Logging Topic
                        <button className='modal-btn' style={{float: 'right', fontSize: '20px'}}>Start</button>
                    </h3>
                    <div className='modal-content'>
                        <p>추후 구현 예정</p>
                    </div>
                </Modal>
            </div>


        </footer>
    );
}

export default MainFooter;



