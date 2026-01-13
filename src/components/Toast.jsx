import React, { useEffect } from 'react';

const Toast = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    return (
        <div className="toast-item">
        <img
        src={toast.image.startsWith('http') ? toast.image : `/assets/img/${toast.image}`}
        alt={toast.name}
        className="toast-img"
        />
        <div className="toast-info">
        <span className="toast-title">{toast.name}</span>
        <span className="toast-msg">Agregado al carrito</span>
        </div>
        </div>
    );
};

export default Toast;
