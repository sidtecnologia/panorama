import React, { useState, useEffect } from 'react';
import { money } from '../utils/helpers';

const ProductModal = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;
    const [qty, setQty] = useState(1);
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        setQty(1);
        setImgIndex(0);
    }, [product]);

    const handleAddToCart = () => {
        onAddToCart(product, qty);
        onClose();
    };

    const images = product.image || [];

    const increase = () => {
        const max = product.stock || 9999;
        setQty(q => Math.min(max, q + 1));
    };

    const decrease = () => {
        setQty(q => Math.max(1, q - 1));
    };

    const onChangeQty = (e) => {
        const val = Math.max(1, parseInt(e.target.value) || 1);
        const max = product.stock || 9999;
        setQty(Math.min(max, val));
    };

    return (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content-wrapper">
                <div className="modal-card">
                    <button className="modal-close" onClick={onClose}>&times;</button>

                    <div className="carousel-container">
                        <button className="carousel-btn prev-btn" onClick={() => setImgIndex(i => Math.max(0, i - 1))}>
                            <i className="fas fa-circle-arrow-left"></i>
                        </button>
                        <div className="carousel-images-container" style={{ transform: `translateX(-${imgIndex * 100}%)` }}>
                            {images.length > 0 ? images.map((src, i) => (
                                <img key={i} src={src} className="carousel-image" alt="" />
                            )) : <div className="carousel-image">Sin imagen</div>}
                        </div>
                        <button className="carousel-btn next-btn" onClick={() => setImgIndex(i => Math.min(images.length - 1, i + 1))}>
                            <i className="fas fa-circle-arrow-right"></i>
                        </button>
                    </div>

                    <div className="modal-caption">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p className="price">${money(product.price)}</p>
                        <div className="qty-row">
                            <label style={{ marginRight: '8px' }}>Cantidad</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button className="qty-btn" onClick={decrease}>-</button>
                                <input type="number" min="1" value={qty} onChange={onChangeQty} />
                                <button className="qty-btn" onClick={increase}>+</button>
                            </div>
                        </div>
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>Añadir al carrito</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;