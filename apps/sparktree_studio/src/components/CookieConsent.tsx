'use client';

import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onNavigate: (page: string) => void;
}

export default function CookieConsent({ onNavigate }: CookieConsentProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sparktree_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sparktree_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('sparktree_cookie_consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm w-full animate-slide-up" style={{ animation: 'slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3750f0] to-[#41f0a5]"></div>
        
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-2.5 rounded-full text-gray-900 shrink-0 mt-0.5">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 12.5v.01"></path><path d="M12 16v.01"></path><path d="M11 12.5v.01"></path></svg>
          </div>
          <div>
            <h3 className="text-gray-950 font-bold mb-1.5 leading-tight">Nos importan tus cookies</h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Utilizamos cookies para mejorar tu experiencia de usuario, optimizar el rendimiento y analizar el tráfico de forma anónima. Conoce más en nuestras <button onClick={() => onNavigate('privacy')} className="text-[#3750f0] font-bold hover:underline transition-all active:scale-95">Políticas de Privacidad</button>.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
          <button 
            onClick={handleReject}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors w-full sm:w-auto text-center"
          >
            Solo necesarias
          </button>
          <button 
            onClick={handleAccept}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gray-950 hover:bg-gray-800 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto text-center"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
