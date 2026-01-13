import React, { useState } from 'react';

const CheckoutModal = ({ isOpen, onClose, onFinalize, onBackToCart }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('Efectivo');
    const [terms, setTerms] = useState(false);

    const handleSubmit = () => {
        if (!terms) return alert('Debes aceptar los Términos y Condiciones.');
        if (!name || !address) return alert('Completa nombre y dirección.');
        onFinalize({ name, address, payment });
    };

    const handleBack = () => {
        onClose();
        onBackToCart();
    };

    return (
        <div
        className={`checkout-modal-overlay ${isOpen ? 'active' : ''}`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        >
        <div className="checkout-modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '20px' }}>Datos de entrega</h2>

        <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Nombre:</label>
        <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Tu nombre completo"
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Dirección:</label>
        <input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Barrio, Calle y Número"
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        </div>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Método de pago:</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <input type="radio" name="payment" value="Efectivo" checked={payment === 'Efectivo'} onChange={() => setPayment('Efectivo')} />
        Efectivo
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <input type="radio" name="payment" value="Transferencia" checked={payment === 'Transferencia'} onChange={() => setPayment('Transferencia')} />
        Transferencia (Nequi/Daviplata)
        </label>
        </div>

        <div className="terms-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '30px' }}>
        <input
        type="checkbox"
        id="terms"
        checked={terms}
        onChange={e => setTerms(e.target.checked)}
        style={{ marginTop: '4px' }}
        />
        <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#666' }}>
        Acepto los términos y condiciones.
        </label>
        </div>

        <div style={{ marginTop: 'auto' }}>
        <button className="checkout-btn" onClick={handleSubmit} style={{ width: '100%', marginBottom: '10px' }}>
        Finalizar Pedido
        </button>
        <button
        className="add-to-cart-btn"
        onClick={handleBack}
        style={{ width: '100%', background: '#eee', color: '#333', border: 'none' }}
        >
        Continuar comprando
        </button>
        </div>
        </div>
        </div>
    );
};

export default CheckoutModal;
