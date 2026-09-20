'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CATALOGS_DATA } from '@/src/data/catalogs';
import { toggleProductSelection, clearAllSelections } from '@/src/utils/inquiry-cart.js';

const WHATSAPP_NUMBER = '584141536516';

export default function InquiryFloatingCart() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customNote, setCustomNote] = useState<string>('');

  // Synchronize with localStorage & custom event
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const saved = localStorage.getItem('bellagio_selected_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSelectedIds(parsed.map(String));
            return;
          }
        }
        setSelectedIds([]);
      } catch {
        setSelectedIds([]);
      }
    };

    syncFromStorage();

    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ selectedIds?: string[] }>;
      if (customEvent.detail?.selectedIds) {
        setSelectedIds(customEvent.detail.selectedIds.map(String));
      } else {
        syncFromStorage();
      }
    };

    window.addEventListener('bellagio:cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('bellagio:cart-updated', handleCartUpdate);
    };
  }, []);

  // Lock body scroll when review modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  // Find corresponding products
  const selectedProducts = useMemo(() => {
    const idSet = new Set(selectedIds);
    return CATALOGS_DATA.filter((item) => idSet.has(String(item.id)));
  }, [selectedIds]);

  const count = selectedIds.length;

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProductSelection(id);
  };

  const handleClearAll = () => {
    if (confirm('¿Deseas vaciar toda tu selección de piezas?')) {
      clearAllSelections();
      setSelectedIds([]);
      setIsOpen(false);
    }
  };

  const handleSendWhatsApp = () => {
    // Auto-clear list after triggering WhatsApp quote
    clearAllSelections();
    setSelectedIds([]);
    setCustomNote('');
    setIsOpen(false);
  };

  // Build WhatsApp URL with full itemized list
  const whatsappUrl = useMemo(() => {
    let msg = `✨ *Consulta de Selección - Muebles Bellagio*\n\n`;
    msg += `Hola, deseo cotizar las siguientes piezas que seleccioné en su página web:\n\n`;

    selectedProducts.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.title}*\n`;
      msg += `   📂 ${item.categoryName} | 📐 ${item.dimensions || 'Medidas estándar'}\n\n`;
    });

    msg += `Total de piezas: ${selectedProducts.length}\n`;

    if (customNote.trim()) {
      msg += `\n💬 *Nota adicional:* ${customNote.trim()}\n`;
    }

    msg += `\nPor favor, confirmar disponibilidad, acabados y tiempos de entrega. ¡Muchas gracias!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [selectedProducts, customNote]);

  if (count === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Inquiry Button */}
      <button
        type="button"
        className={`inquiry-cart-fab ${count > 0 ? 'visible' : ''}`}
        id="inquiryCartFAB"
        onClick={() => setIsOpen(true)}
        aria-label={`Ver mi selección de ${count} ${count === 1 ? 'pieza' : 'piezas'}`}
        title="Ver mi selección de piezas"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>

        <span className="inquiry-fab-text">Mi Selección</span>
        <span className="fab-count-badge">{count}</span>
      </button>

      {/* Review Modal Backdrop & Sheet */}
      <div
        className={`inquiry-modal-backdrop ${isOpen ? 'open' : ''}`}
        id="inquiryModalBackdrop"
        onClick={() => setIsOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Resumen de selección de piezas"
      >
        <div
          className="inquiry-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Sheet Drag Handle */}
          <div className="sheet-drag-handle" aria-hidden="true">
            <span className="drag-pill"></span>
          </div>

          {/* Modal Header */}
          <header className="inquiry-modal-header">
            <div className="inquiry-modal-header-text">
              <h2>Tu Selección de Piezas</h2>
              <p>
                {selectedProducts.length}{' '}
                {selectedProducts.length === 1
                  ? 'pieza seleccionada'
                  : 'piezas seleccionadas'}
              </p>
            </div>

            <button
              type="button"
              className="inquiry-modal-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar ventana de selección"
              title="Cerrar (Esc)"
            >
              ✕
            </button>
          </header>

          {/* Modal Body: Selected Products List */}
          <div className="inquiry-modal-body" id="inquiryModalBody">
            {selectedProducts.length === 0 ? (
              <div className="inquiry-empty-state">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <h3>Aún no has seleccionado piezas</h3>
                <p>
                  Explora el catálogo y marca las piezas que te gusten tocando
                  el botón <strong>"Marcar Producto"</strong> en cada ficha.
                </p>
              </div>
            ) : (
              <div className="inquiry-products-grid">
                {selectedProducts.map((item) => (
                  <div key={item.id} className="inquiry-product-card">
                    <div className="inquiry-product-img-wrapper">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        width={90}
                        height={90}
                      />
                    </div>

                    <div className="inquiry-product-info">
                      <span className="inquiry-product-category">
                        {item.categoryName}
                      </span>
                      <h4>{item.title}</h4>
                      <p>
                        {item.materials
                          ? item.materials.slice(0, 50) + '...'
                          : 'Alta Ebanistería'}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inquiry-remove-btn"
                      onClick={(e) => handleRemove(item.id, e)}
                      aria-label={`Eliminar ${item.title} de mi selección`}
                      title="Eliminar de mi selección"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer: Clear, Note & WhatsApp Action */}
          {selectedProducts.length > 0 && (
            <footer className="inquiry-modal-footer">
              <div className="inquiry-footer-top">
                <button
                  type="button"
                  className="inquiry-clear-btn"
                  onClick={handleClearAll}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Vaciar lista
                </button>
              </div>

              {/* Optional Custom Note */}
              <div className="inquiry-message-box">
                <textarea
                  className="inquiry-textarea form-textarea"
                  placeholder="Nota adicional (opcional): medidas especiales, colores, solicitud de visita..."
                  rows={2}
                  maxLength={400}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                />
              </div>

              {/* Primary WhatsApp Conversion CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg inquiry-send-btn"
                onClick={handleSendWhatsApp}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>
                  Cotizar Selección ({selectedProducts.length}{' '}
                  {selectedProducts.length === 1 ? 'pieza' : 'piezas'}) por WhatsApp
                </span>
              </a>
            </footer>
          )}
        </div>
      </div>
    </>
  );
}
