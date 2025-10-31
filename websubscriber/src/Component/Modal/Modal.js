// 모달창 컴포넌트
//isOpen: 모달창이 열렸을 떄, onClose: 모달창이 닫혔을 떄, children:안에 들어갈 내용

import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <>
            {isOpen && (
                <div
                    className="modal-overlay"
                    onClick={onClose}
                    aria-modal="true"
                >
                    <div
                        className="modal-space"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
