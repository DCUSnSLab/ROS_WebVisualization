//모달 컴포넌트

import { IoClose } from "react-icons/io5";
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close">
                    <IoClose />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;