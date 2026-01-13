import React from 'react';

const Navbar = ({ cartCount, onSearch, onOpenCart }) => {
    return (
        <nav className="navbar">
        <div className="nav-left">
        <img src="src/assets/img/favicon.png" alt="Logo" className="nav-logo-img" />
        <h1 className="logo">Panorama</h1>
        </div>

        <div className="search-container">
        <input
        id="search-input"
        type="search"
        placeholder="Buscar..."
        onChange={(e) => onSearch(e.target.value)}
        />
        </div>

        <button
        id="cart-btn"
        className={`nav-cart-btn ${cartCount > 0 ? 'cart-animate has-items' : ''}`}
        onClick={onOpenCart}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {cartCount > 0 && <span id="cart-badge" className="cart-badge">{cartCount}</span>}
        </button>
        </nav>
    );
};

export default Navbar;
