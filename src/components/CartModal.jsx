import React from 'react';
import { money } from '../utils/helpers';

const CartModal = ({ isOpen, cart, onClose, onUpdateQty, onCheckout }) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const handleCheckout = () => {
        onClose(); // Cierra el carrito primero
        onCheckout(); // Abre el checkout
    };

    return (
        <div
        className={`cart-modal-overlay ${isOpen ? 'active' : ''}`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        >
        <div className="cart-modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>Tu pedido</h3>

        <div className="cart-items">
        {cart.length === 0 ? (
            <p className="empty-cart-msg">Tu carrito está vacío.</p>
        ) : (
            cart.map((item, idx) => (
                <div key={item.id} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                src={item.image.startsWith('http') ? item.image : `/assets/img/${item.image}`}
                alt={item.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>{item.name}</strong>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {item.qty} x ${money(item.price)}
                </div>
                </div>
                </div>
                <div className="controls">
                <button className="qty-btn" onClick={() => onUpdateQty(idx, -1)}>-</button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                <button className="qty-btn" onClick={() => onUpdateQty(idx, 1)}>+</button>
                </div>
                </div>
            ))
        )}
        </div>

        <div className="cart-summary" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
        {cart.length > 0 && (
            <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.1rem' }}>
            <strong>Total:</strong>
            <strong style={{ color: 'var(--primary)' }}>${money(total)}</strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout} style={{ width: '100%', marginBottom: '10px' }}>
            Hacer Pedido
            </button>
            </>
        )}
        <button
        className="add-to-cart-btn"
        onClick={onClose}
        style={{ width: '100%', background: '#666', border: 'none' }}
        >
        Continuar comprando
        </button>
        </div>
        </div>
        </div>
    );
};

export default CartModal;
