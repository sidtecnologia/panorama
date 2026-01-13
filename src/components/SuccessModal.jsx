import React from 'react';
import { money } from '../utils/helpers';

const SuccessModal = ({ orderDetails, onClose, onWhatsApp }) => {
    if (!orderDetails) return null;

    return (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content-wrapper">
        <div className="success-modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>¡Tu compra está casi lista!</h2>
        <p><strong>Total:</strong> ${money(orderDetails.total)}</p>
        <p>Luego de confirmar el pago enviaremos tu pedido.</p>
        <button className="checkout-btn" onClick={onWhatsApp}><i className="fab fa-whatsapp"></i> Confirmar pago</button>
        <button className="add-to-cart-btn" style={{ background: '#666' }} onClick={onClose}>Regresar</button>
        </div>
        </div>
        </div>
    );
};

export default SuccessModal;
