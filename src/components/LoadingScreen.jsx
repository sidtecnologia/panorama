import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ isFinished = false }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let interval;
    if (!isFinished) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          const increment = Math.floor(Math.random() * 4) + 1;
          return Math.min(95, prev + increment);
        });
      }, 200);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isFinished]);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000,
        background: 'transparent',
        pointerEvents: 'none'
      }}
    >
      <div style={{ width: '80%', maxWidth: 520, pointerEvents: 'auto', textAlign: 'center' }}>
        <div style={{ marginBottom: 10, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
          {Math.min(100, Math.round(progress))}%
        </div>
        <div
          aria-hidden="true"
          style={{
            width: '100%',
            height: 6,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 999,
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--primary)',
              transition: 'width 220ms linear'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;