'use client';

import React, { useState } from 'react';
import { STORES_DATA } from '@/src/data/stores';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    store: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp direct message with the form details
    const text = `Hola Muebles Bellagio, mi nombre es ${formData.name}.
Email: ${formData.email}
Teléfono: ${formData.phone}
Tienda de preferencia: ${formData.store || 'Cualquiera'}
Mensaje: ${formData.message}`;

    const waUrl = `https://wa.me/584141536516?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <section id="contactanos" className="section-wrapper" aria-label="Contáctanos">
      <div className="container">
        <header className="section-header">
          <span className="section-tag">Atención Personalizada</span>
          <h2 className="section-title">
            Hablemos de tu <span className="gold-text">Próximo Proyecto</span>
          </h2>
          <p className="section-subtitle">
            Agenda una cita privada con nuestros diseñadores o solicita una cotización exclusiva sin compromiso.
          </p>
        </header>

        <div className="contact-grid">
          {/* Form Container */}
          <div className="luxury-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
              Solicitud de Asesoría & Cotización
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
              Completa el formulario y te conectaremos directamente con un asesor de ventas o interiorista.
            </p>

            {submitted ? (
              <div style={{ padding: 'var(--space-6)', background: 'rgba(197, 165, 90, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gold-500)', textAlign: 'center' }}>
                <h4 className="gold-text" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>¡Mensaje Enviado con Éxito!</h4>
                <p style={{ fontSize: '0.9rem' }}>Se ha abierto tu WhatsApp para confirmar tu solicitud. En breve serás atendido.</p>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  style={{ marginTop: 'var(--space-4)' }}
                  onClick={() => setSubmitted(false)}
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label htmlFor="contactName" className="form-label">Nombre y Apellido *</label>
                  <input 
                    type="text" 
                    id="contactName" 
                    className="form-input" 
                    placeholder="Ej. Carlos Mendoza" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label htmlFor="contactEmail" className="form-label">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      id="contactEmail" 
                      className="form-input" 
                      placeholder="ejemplo@correo.com" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPhone" className="form-label">Teléfono / WhatsApp *</label>
                    <input 
                      type="tel" 
                      id="contactPhone" 
                      className="form-input" 
                      placeholder="0414-1234567" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label htmlFor="contactStore" className="form-label">Sede o Showroom de Preferencia</label>
                  <select 
                    id="contactStore" 
                    className="form-input"
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  >
                    <option value="">Selecciona un Showroom en Caracas</option>
                    {STORES_DATA.map(store => (
                      <option key={store.id} value={store.name}>{store.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="contactMessage" className="form-label">Detalles del Proyecto o Mueble de Interés</label>
                  <textarea 
                    id="contactMessage" 
                    className="form-input" 
                    rows={4} 
                    placeholder="Indícanos qué muebles necesitas (medidas, colores, ambiente)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Solicitar Asesoría por WhatsApp</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="contact-info-card luxury-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-4)' }}>Atención Inmediata</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.92rem' }}>
                Si deseas respuesta inmediata, escríbenos directamente por nuestro canal oficial de WhatsApp o visítanos en cualquiera de nuestras salas de exhibición.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="btn-icon" style={{ background: 'var(--gold-500)', color: '#000' }}>
                    📞
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Línea Directa</div>
                    <strong>+58 414-1536516</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="btn-icon" style={{ background: 'var(--gold-500)', color: '#000' }}>
                    📍
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Showroom Principal</div>
                    <strong>Av. Comercio, Caracas, Venezuela</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="btn-icon" style={{ background: 'var(--gold-500)', color: '#000' }}>
                    ⏰
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Horario de Atención</div>
                    <strong>Lunes a Sábado: 9:00 AM - 5:00 PM</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <a 
                href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20comunicarme%20directamente%20con%20un%20asesor." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Chatear Directo en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
