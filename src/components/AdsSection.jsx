import React from 'react';

const ads = [
    { src: '/assets/img/baner/baner10.webp', id: '6fbce90e-440e-4e18-81e3-51c5fad0b4a1' },
{ src: '/assets/img/baner/baner11.webp', id: '728b36cf-6b4d-4f50-8c99-ccde786cf031' },
{ src: '/assets/img/baner/baner12.webp', id: '7ee78632-0644-4135-8844-ca380201fe96' },
{ src: '/assets/img/baner/baner10.webp', id: '9c6280ad-e209-441b-b750-7a152c038b38' }
];

const AdsSection = ({ onOpenProduct }) => {
    return (
        <section className="ads-section">
        <div className="ads-grid">
        {ads.map((ad, idx) => (
            <img
            key={idx}
            src={ad.src}
            className="ad-image"
            onClick={() => onOpenProduct(ad.id)}
            alt="Publicidad"
            />
        ))}
        </div>
        </section>
    );
};

export default AdsSection;
