'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'bellagio_cookie_consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Delay appearance slightly so the user sees the page hero first
    const timer = setTimeout(() => {
      try {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
          setIsVisible(true);
        }
      } catch {
        // Fallback if localStorage is disabled in private mode
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    setIsClosing(true);
    setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            analytics: true,
            essential: true,
            timestamp: new Date().toISOString(),
          })
        );
      } catch { }
      setIsVisible(false);
    }, 300);
  };

  const handleAcceptEssential = () => {
    setIsClosing(true);
    setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            analytics: false,
            essential: true,
            timestamp: new Date().toISOString(),
          })
        );
      } catch { }
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de privacidad y cookies de Muebles Bellagio"
      className={`luxury-cookie-banner ${isClosing ? 'is-closing' : 'is-entering'}`}
    >
      <div className="luxury-cookie-glass-card">
        {/* Subtle Ambient Gold Glow */}
        <div className="cookie-ambient-glow" aria-hidden="true" />

        <div className="luxury-cookie-content-wrapper">
          {/* Brand Identified Logo */}
          <div className="luxury-cookie-logo-box">
            <div className="luxury-cookie-logo-ring">
              <Image
                src="/logo.png"
                alt="Logo Muebles Bellagio"
                width={46}
                height={46}
                className="luxury-cookie-logo-img"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="luxury-cookie-text-box">
            <div className="luxury-cookie-kicker">
              <span className="kicker-dot" aria-hidden="true" />
              <span>Muebles Bellagio Caracas</span>
            </div>
            <h4 className="luxury-cookie-title">
              Privacidad &amp; Experiencia en el Catálogo
            </h4>
            <p className="luxury-cookie-desc">
              Utilizamos cookies propias y de analítica para recordar tus selecciones de cotización en el catálogo y ofrecerte una experiencia exclusiva de Muebles Bellagio.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="luxury-cookie-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-essential"
            onClick={handleAcceptEssential}
          >
            Solo Necesarias
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={handleAcceptAll}
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
