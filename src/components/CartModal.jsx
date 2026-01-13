import React, { useMemo, useRef, useState } from 'react';
import { money, shuffleArray } from '../utils/helpers';

const CartModal = ({ isOpen, cart, products = [], onClose, onUpdateQty, onCheckout, onAddToCart }) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const recommendations = useMemo(() => {
        const cartIds = new Set(cart.map(i => i.id));
        const pool = products.filter(p => !cartIds.has(p.id) && (p.stock || 0) > 0);
        return shuffleArray(pool).slice(0, 8);
    }, [products, cart]);

    const handleAddRecommendation = (product) => {
        onAddToCart(product, 1);
    };

    const handleCheckout = () => {
        onClose();
        onCheckout();
    };

    const scrollRef = useRef(null);
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

    const onPointerDown = (e) => {
        isDownRef.current = true;
        setIsDragging(true);
        startXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        scrollLeftRef.current = scrollRef.current ? scrollRef.current.scrollLeft : 0;
        if (scrollRef.current) scrollRef.current.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!isDownRef.current || !scrollRef.current) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const walk = (startXRef.current - x);
        scrollRef.current.scrollLeft = scrollLeftRef.current + walk;
    };

    const onPointerUp = (e) => {
        isDownRef.current = false;
        setIsDragging(false);
        if (scrollRef.current) {
            try { scrollRef.current.releasePointerCapture(e.pointerId); } catch (err) {}
        }
    };

    return (
        <div
            className={`cart-modal-overlay ${isOpen ? 'active' : ''}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="cart-modal-card">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3>Tu pedido</h3>

                <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px' }}>
                    {cart.length === 0 ? (
                        <p className="empty-cart-msg">Tu carrito está vacío.</p>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={item.id} className="cart-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <img
                                        src={item.image && item.image.startsWith('http') ? item.image : `/assets/img/${item.image}`}
                                        alt={item.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                                    />
                                    <div style={{ minWidth: 0 }}>
                                        <strong style={{ fontSize: '0.9rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</strong>
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

                <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                    

                    {cart.length > 0 && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.05rem' }}>
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
                    </button><h4 style={{ margin: '8px 0' }}>Recomendados para ti</h4>
                    <div
                        className="recommendations-scroll"
                        ref={scrollRef}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        {recommendations.map(rec => {
                            const imgSrc = Array.isArray(rec.image) ? rec.image[0] : rec.image;
                            const src = imgSrc && imgSrc.startsWith('http') ? imgSrc : `/assets/img/${imgSrc}`;
                            return (
                                <div className="rec-card" key={rec.id}>
                                    <img src={src} alt={rec.name} />
                                    <div className="rec-info">
                                        <div className="rec-name" title={rec.name}>{rec.name}</div>
                                        <div className="rec-price">${money(rec.price)}</div>
                                    </div>
                                    <button className="rec-add" onClick={() => handleAddRecommendation(rec)}>Añadir</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartModal;