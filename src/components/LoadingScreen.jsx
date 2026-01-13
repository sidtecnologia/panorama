import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="loader-overlay">
        <img src="/assets/img/favicon.png" alt="Logo Panorama" className="loader-logo" />
        <p style={{
            fontWeight: '600',
            color: 'var(--primary)',
            letterSpacing: '1px',
            fontSize: '1.1rem'
        }}>
        Cargando...
        </p>
        </div>
    );
};

export default LoadingScreen;
