import React from 'react';
import { money } from '../utils/helpers';

const ProductCard = ({ product, onOpenModal }) => {
    const isOutOfStock = !product.stock || product.stock <= 0;

    return (
        <div
        className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
        onClick={() => onOpenModal(product)}
        >
        {product.bestSeller && <div className="best-seller-tag">Lo más vendido</div>}
        <img src={product.image[0]} alt={product.name} className="product-image" loading="lazy" />
        {isOutOfStock && <div className="out-of-stock-overlay">Agotado</div>}
        <div className="product-info">
        <div>
        <div className="product-name">{product.name}</div>
        <div className="product-description">{product.description}</div>
        </div>
        <div style={{ marginTop: '8px' }}>
        <div className="product-price">${money(product.price)}</div>
        </div>
        </div>
        </div>
    );
};

export default ProductCard;
