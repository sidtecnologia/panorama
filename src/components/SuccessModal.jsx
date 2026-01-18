import React from 'react';
import { money, calcBaseFromIncluded } from '../utils/helpers';

const SuccessModal = ({ orderDetails, onClose, onWhatsApp }) => {
    if (!orderDetails) return null;

    const items = orderDetails.order_items || [];
    const subtotalIncluded = items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 0), 0);
    const base = calcBaseFromIncluded(subtotalIncluded);
    const tax = subtotalIncluded - base;
    const total = orderDetails.total_amount || subtotalIncluded;

    return (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content-wrapper">
        <div className="success-modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>¡Tu compra está casi lista!</h2>
        <p><strong>Subtotal (sin IVA):</strong> ${money(base)}</p>
        <p><strong>IVA 19%:</strong> ${money(tax)}</p>
        <p><strong>Total:</strong> ${money(total)}</p>
        <p>Luego de confirmar el pago enviaremos tu pedido.</p>
        <button className="checkout-btn" onClick={onWhatsApp}><i className="fab fa-whatsapp"></i> Confirmar pago</button>
        <button className="add-to-cart-btn" style={{ background: '#666' }} onClick={onClose}>Regresar</button>
        </div>
        </div>
        </div>
    );
};

export default SuccessModal;