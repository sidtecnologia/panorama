import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ isFinished = false }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        
        if (!isFinished) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    // Incrementos aleatorios suaves
                    const next = prev + Math.floor(Math.random() * 4) + 2;
                    return Math.min(90, next);
                });
            }, 200);
        } else {
            setProgress(100);
        }

        return () => clearInterval(interval);
    }, [isFinished]);

    return (
        <div className={`loader-overlay ${progress === 100 ? 'fade-out' : ''}`}>
            <div className="loader-content">
                <img 
                    src="/assets/img/favicon.png" 
                    alt="Logo" 
                    className="loader-logo" 
                />
                <div className="loader-bar">
                    <div 
                        className="loader-progress" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;