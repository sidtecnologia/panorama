import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setProgress(p => {
                if (p >= 90) return p;
                const next = p + Math.floor(Math.random() * 8) + 4;
                return Math.min(90, next);
            });
        }, 200);

        return () => {
            clearInterval(id);
            setProgress(100);
        };
    }, []);

    useEffect(() => {
        if (progress === 100) {
            const t = setTimeout(() => setProgress(100), 250);
            return () => clearTimeout(t);
        }
    }, [progress]);

    return (
        <div className="loader-overlay">
            <img src="/assets/img/favicon.png" alt="Logo Panorama" className="loader-logo" />
            <div className="loader-bar">
                <div className="loader-progress" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default LoadingScreen;