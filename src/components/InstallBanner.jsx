import React, { useEffect, useState } from 'react';

const InstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setVisible(false);
    };

    return (
        <div className={`install-banner ${visible ? 'visible' : ''}`} hidden={!visible}>
        <span>Añadir a pantalla de inicio</span>
        <div>
        <button onClick={() => setVisible(false)}>No</button>
        <button className="install-btn" onClick={handleInstall}>Instalar</button>
        </div>
        </div>
    );
};

export default InstallBanner;
