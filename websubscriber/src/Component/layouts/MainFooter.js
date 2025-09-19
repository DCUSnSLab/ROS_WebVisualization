// 메인화면 하단 푸터 컴포넌트
import { FaPlay } from "react-icons/fa";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import './MainLayout.css';

function MainFooter(){

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
                <button className='logging-btn'>Logiging</button>
            </div>


        </footer>
    );
}

export default MainFooter;



