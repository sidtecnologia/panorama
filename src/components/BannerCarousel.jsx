import React, { useState, useEffect } from 'react';

const images = [
    '/assets/img/baner/baner1.webp', '/assets/img/baner/baner2.webp', '/assets/img/baner/baner3.webp',
'/assets/img/baner/baner4.webp', '/assets/img/baner/baner5.webp', '/assets/img/baner/baner6.webp',
'/assets/img/baner/baner7.webp', '/assets/img/baner/baner8.webp', '/assets/img/baner/baner9.webp'
];

const BannerCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="banner-section">
        <div className="banner-carousel" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, idx) => (
            <div className="banner-slide" key={idx}>
            <img src={src} alt={`Promoción ${idx + 1}`} />
            </div>
        ))}
        </div>
        <div className="banner-dots">
        {images.map((_, idx) => (
            <div
            key={idx}
            className={`banner-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            ></div>
        ))}
        </div>
        </section>
    );
};

export default BannerCarousel;
