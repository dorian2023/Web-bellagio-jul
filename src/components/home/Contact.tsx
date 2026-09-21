'use client';

import React, { useState } from 'react';
import { STORES_DATA } from '@/src/data/stores';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    handle: '@mueblesbellagio',
    url: 'https://www.instagram.com/mueblesbellagio/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    color: '#E1306C'
  },
  {
    name: 'TikTok',
    handle: '@mueblesbellagio',
    url: 'https://www.tiktok.com/@mueblesbellagio',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46V12a8.28 8.28 0 0 0 5.77 2.31V10.8a4.87 4.87 0 0 1-3.8-1.57v-.03a4.78 4.78 0 0 1 3.8-2.51V6.69z"/>
      </svg>
    ),
    color: '#00F2FE'
  },
  {
    name: 'Facebook',
    handle: 'Muebles Bellagio',
    url: 'https://www.facebook.com/mueblesbellagiostore/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877F2'
  }
];

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

          {/* Quick Contact Info & Official Social Media */}
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

              {/* Official Social Media Community */}
              <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-accent)' }}>
                  Síguenos en Redes Sociales
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-pill"
                      title={`${social.name} de Muebles Bellagio (${social.handle})`}
                    >
                      <span className="contact-social-icon">{social.icon}</span>
                      <span className="contact-social-name">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <a 
                href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20comunicarme%20directamente%20con%20un%20asesor." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>Chatear Directo en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
