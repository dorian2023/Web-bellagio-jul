'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LuxuryNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [destinationLabel, setDestinationLabel] = useState('Cargando experiencia...');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  // When pathname or searchParams change, complete the loading animation smoothly
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);

      const completeTimer = setTimeout(() => {
        setIsNavigating(false);
        setShowOverlay(false);
        setProgress(0);
      }, 200);

      return () => clearTimeout(completeTimer);
    }
  }, [pathname, searchParams]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore right clicks or modified clicks (Ctrl, Cmd, Shift, Alt)
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return;
      }

      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');

      // Ignore external links, downloads, mailto, tel, or target="_blank"
      if (!href || targetAttr === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      // Ignore in-page hashes on same page
      if (href.startsWith('#')) return;

      // Handle internal relative paths
      try {
        const currentUrl = new URL(window.location.href);
        const destinationUrl = new URL(href, window.location.href);

        // Ignore different origin
        if (destinationUrl.origin !== currentUrl.origin) return;

        // Ignore exact same URL (pathname + search + hash)
        if (
          destinationUrl.pathname === currentUrl.pathname &&
          destinationUrl.search === currentUrl.search &&
          destinationUrl.hash === currentUrl.hash
        ) {
          return;
        }

        // Determine destination label for luxury overlay
        let label = 'Cargando Muebles Bellagio...';
        const destPath = destinationUrl.pathname;
        if (destPath.startsWith('/catalogo')) {
          label = 'Cargando Catálogo Exclusivo...';
        } else if (destPath.startsWith('/tiendas')) {
          label = 'Accediendo a Showrooms en Caracas...';
        } else if (destPath === '/') {
          label = 'Regresando a la Página Principal...';
        } else if (destPath.startsWith('/admin')) {
          label = 'Accediendo al Panel de Administración...';
        }

        setDestinationLabel(label);

        // Instant response: Trigger top golden progress bar
        setIsNavigating(true);
        setProgress(28);

        if (timerRef.current) clearInterval(timerRef.current);
        if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
        if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

        // Smooth simulated progress tick
        timerRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev < 60) return prev + 18;
            if (prev < 82) return prev + 8;
            if (prev < 94) return prev + 3;
            return prev;
          });
        }, 120);

        // If page takes more than 240ms, show the luxury seal overlay
        overlayTimerRef.current = setTimeout(() => {
          setShowOverlay(true);
        }, 240);

        // Safety timeout to avoid hanging loader if navigation fails or aborts
        safetyTimeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
          setShowOverlay(false);
          setProgress(0);
          if (timerRef.current) clearInterval(timerRef.current);
        }, 8000);
      } catch {
        // Safe fallback
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <>
      {/* 1. TOP GOLDEN PROGRESS BAR (Instant 0ms Feedback) */}
      <div
        className={`luxury-progress-container ${isNavigating ? 'is-active' : 'is-finished'}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Progreso de navegación"
      >
        <div
          className="luxury-progress-bar"
          style={{ width: `${progress}%` }}
        >
          {/* Glowing pulse head on progress bar */}
          <div className="luxury-progress-glow" />
        </div>
      </div>

      {/* 2. LUXURY TRANSITION SEAL OVERLAY (Shown if transition > 240ms) */}
      {showOverlay && (
        <div
          className="luxury-page-transition-overlay"
          aria-live="polite"
          aria-label={destinationLabel}
        >
          <div className="luxury-transition-backdrop-blur" />
          
          <div className="luxury-transition-card">
            {/* Ambient gold glow */}
            <div className="luxury-transition-ambient" aria-hidden="true" />

            <div className="luxury-transition-seal-wrapper">
              <div className="luxury-seal-orbit-ring" aria-hidden="true" />
              <div className="luxury-seal-inner-core">
                <Image
                  src="/logo.png"
                  alt="Muebles Bellagio"
                  width={56}
                  height={56}
                  priority
                  className="luxury-seal-image"
                />
              </div>
            </div>

            <div className="luxury-transition-text-box">
              <span className="luxury-transition-kicker">MUEBLES BELLAGIO</span>
              <h5 className="luxury-transition-label">{destinationLabel}</h5>
            </div>

            <div className="luxury-transition-meter-bar">
              <div className="luxury-meter-fill" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
