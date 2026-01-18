import React, { useState } from 'react';
import { calcBaseFromIncluded, money } from '../utils/helpers';

const CheckoutModal = ({ isOpen, onClose, onFinalize, onBackToCart, cart = [] }) => {
    const [activeTab, setActiveTab] = useState('simple');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        payment: 'Efectivo',
        terms: false,
        documentType: '13',
        documentNumber: '',
        email: '',
        phone: ''
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
        if (!formData.name || !formData.address) return alert('Nombre y dirección son obligatorios.');

        if (activeTab === 'fiscal') {
            if (!formData.documentNumber || !formData.email || !formData.phone) {
                return alert('Para factura electrónica, completa todos los datos fiscales.');
            }
        }

        try {
            setLoading(true);
            const legalOrgId = activeTab === 'fiscal' ? (formData.documentType === '31' ? '1' : '2') : null;
            onFinalize({
                ...formData,
                is_fiscal: activeTab === 'fiscal',
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

                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '2px solid #eee' }}>
                    <button 
                        onClick={() => setActiveTab('simple')}
                        style={{
                            flex: 1, padding: '10px', border: 'none', background: 'none',
                            borderBottom: activeTab === 'simple' ? '3px solid var(--secondary)' : 'none',
                            fontWeight: activeTab === 'simple' ? '700' : '400', cursor: 'pointer'
                        }}
                    >
                        Pedido sin Factura
                    </button>
                    <button 
                        onClick={() => setActiveTab('fiscal')}
                        style={{
                            flex: 1, padding: '10px', border: 'none', background: 'none',
                            borderBottom: activeTab === 'fiscal' ? '3px solid var(--primary)' : 'none',
                            fontWeight: activeTab === 'fiscal' ? '700' : '400', cursor: 'pointer'
                        }}
                    >
                        Factura Electrónica
                    </button>
                </div>

                <div className="cart-items" style={{ flex: '1', paddingRight: '5px' }}>
                    <div className="form-group">
                        <label>Nombre Completo:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Juan Pérez" />
                    </div>

                    <div className="form-group">
                        <label>Dirección de Entrega:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Calle, Barrio, Casa" />
                    </div>

                    {activeTab === 'fiscal' && (
                        <div style={{ animation: 'slideDown 0.3s ease' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Tipo:</label>
                                    <select name="documentType" value={formData.documentType} onChange={handleChange} style={{padding:'10px', borderRadius:'6px', border:'1px solid #ddd'}}>
                                        <option value="13">C.C.</option>
                                        <option value="31">NIT</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Documento:</label>
                                    <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Correo (para la Factura):</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Teléfono:</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    <div className="form-group" style={{ marginTop: '10px' }}>
                        <label style={{fontWeight:'700'}}>Método de pago:</label>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                            <label><input type="radio" name="payment" value="Efectivo" checked={formData.payment === 'Efectivo'} onChange={handleChange} /> Efectivo</label>
                            <label><input type="radio" name="payment" value="Transferencia" checked={formData.payment === 'Transferencia'} onChange={handleChange} /> Transferencia</label>
                        </div>
                    </div>

                    <div className="terms-consent" style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                        <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Acepto el tratamiento de mis datos.</label>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subtotal (sin IVA)</span>
                            <strong>${money(base)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>IVA (19%)</span>
                            <strong>${money(tax)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Total</strong>
                            <strong style={{ color: 'var(--primary)' }}>${money(total)}</strong>
                        </div>
                    </div>
                    <button className="checkout-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Procesando...' : 'Finalizar Compra'}</button>
                    <button className="add-to-cart-btn" onClick={() => { onClose(); onBackToCart && onBackToCart(); }} style={{ background: '#eee', color: '#333' }}>Regresar al carrito</button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;