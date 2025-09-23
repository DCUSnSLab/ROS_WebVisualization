import React, { useEffect } from "react";
import "../../css/Modal.css";

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
