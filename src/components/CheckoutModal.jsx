import React, { useState } from 'react';
import { calcBaseFromIncluded, money } from '../utils/helpers';

const CheckoutModal = ({ isOpen, onClose, onFinalize, onBackToCart, cart = [] }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        payment: 'Efectivo',
        terms: false,
        needsInvoice: false,
        documentType: '13',
        documentNumber: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.terms) return alert('Debes aceptar los términos y condiciones.');
        if (!formData.name || !formData.address || !formData.phone) return alert('Nombre, dirección y teléfono son obligatorios para el envío.');

        if (formData.needsInvoice) {
            if (!formData.documentNumber || !formData.email) {
                return alert('Para factura electrónica, el documento y correo son obligatorios.');
            }
        }

        try {
            setLoading(true);
            const legalOrgId = formData.needsInvoice ? (formData.documentType === '31' ? '1' : '2') : null;

            onFinalize({
                ...formData,
                is_fiscal: formData.needsInvoice,
                legal_organization_id: legalOrgId
            });
        } catch (err) {
            alert(err.message || 'Error al procesar el pedido.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const subtotalIncluded = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const base = calcBaseFromIncluded(subtotalIncluded);
    const tax = subtotalIncluded - base;
    const total = subtotalIncluded;

    return (
        <div className={`checkout-modal-overlay active`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="checkout-modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>

        <h2 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Finalizar Pedido</h2>

        <div className="cart-items" style={{ flex: '1', paddingRight: '5px' }}>

        <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}>Datos de Entrega</h3>

        <div className="form-group">
        <label>Nombre Completo:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Juan Pérez" />
        </div>

        <div className="form-group">
        <label>Teléfono / Celular:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Para coordinar la entrega" />
        </div>

        <div className="form-group">
        <label>Dirección de Entrega:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Calle, Barrio, Casa" />
        </div>

        <div style={{ margin: '20px 0', padding: '15px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
        <div className="terms-consent" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: formData.needsInvoice ? '15px' : '0' }}>
        <input
        type="checkbox"
        id="needsInvoice"
        name="needsInvoice"
        checked={formData.needsInvoice}
        onChange={handleChange}
        style={{ width: '18px', height: '18px' }}
        />
        <label htmlFor="needsInvoice" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
        Requiero Factura Electrónica
        </label>
        </div>

        {formData.needsInvoice && (
            <div style={{ animation: 'slideDown 0.3s ease' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
            <label>Tipo:</label>
            <select name="documentType" value={formData.documentType} onChange={handleChange} style={{padding:'10px', borderRadius:'6px', border:'1px solid #ddd', width: '100%'}}>
            <option value="13">C.C.</option>
            <option value="31">NIT</option>
            </select>
            </div>
            <div className="form-group" style={{ flex: 2 }}>
            <label>Número de Documento:</label>
            <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} />
            </div>
            </div>
            <div className="form-group">
            <label>Correo Electrónico (para envío de factura):</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            </div>
        )}
        </div>

        <div className="form-group" style={{ marginTop: '10px' }}>
        <label style={{fontWeight:'700'}}>Método de pago:</label>
        <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
        <label><input type="radio" name="payment" value="Efectivo" checked={formData.payment === 'Efectivo'} onChange={handleChange} /> Efectivo</label>
        <label><input type="radio" name="payment" value="Transferencia" checked={formData.payment === 'Transferencia'} onChange={handleChange} /> Transferencia</label>
        </div>
        </div>

        <div className="terms-consent" style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
        <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
        <label style={{ fontSize: '0.8rem', color: '#666' }}>Acepto el tratamiento de mis datos y la política de privacidad.</label>
        </div>
        </div>

        <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Subtotal (Base)</span>
        <strong>${money(base)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>IVA (19%)</span>
        <strong>${money(tax)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '8px' }}>
        <strong>Total a Pagar</strong>
        <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>${money(total)}</strong>
        </div>
        </div>
        <button className="checkout-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Procesando...' : 'Confirmar Pedido'}</button>
        <button className="add-to-cart-btn" onClick={() => { onClose(); onBackToCart && onBackToCart(); }} style={{ background: '#eee', color: '#333' }}>Volver al carrito</button>
        </div>
        </div>
        </div>
    );
};

export default CheckoutModal;
