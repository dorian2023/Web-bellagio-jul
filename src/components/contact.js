/**
 * @file contact.js
 * @description Contact section presentation component with secure consultation form and showroom info.
 */

import { STORES_DATA } from '../data/stores.js';
import { escapeHTML, sanitizeInput, validateEmail, validatePhone, createRateLimiter } from '../utils/security.js';

export function renderContact() {
  const storeOptionsHTML = STORES_DATA.map(store => `
    <option value="${escapeHTML(store.name)}">${escapeHTML(store.name)}</option>
  `).join('');

  return `
    <section id="contactanos" class="section-wrapper" aria-label="Contáctanos">
      <div class="container">
        <header class="section-header reveal-item">
          <span class="section-tag">Atención Personalizada</span>
          <h2 class="section-title">
            Hablemos de tu <span class="gold-text">Próximo Proyecto</span>
          </h2>
          <p class="section-subtitle">
            Agenda una cita privada con nuestros diseñadores o solicita una cotización exclusiva sin compromiso.
          </p>
        </header>

        <div class="contact-grid">
          <!-- Form Container -->
          <div class="luxury-card reveal-item">
            <h3 style="font-size: 1.5rem; margin-bottom: var(--space-2);">Solicitud de Asesoría & Cotización</h3>
            <p style="font-size: 0.9rem; margin-bottom: var(--space-6); color: var(--color-text-secondary);">
              Completa el formulario y un especialista se pondrá en contacto contigo en menos de 2 horas.
            </p>

            <div id="formFeedback" class="form-feedback" role="alert"></div>

            <form id="contactForm" novalidate autocomplete="on">
              <!-- Honeypot anti-spam (hidden from users) -->
              <div style="display:none !important;" aria-hidden="true">
                <label for="bellagio_hp">Leave empty</label>
                <input type="text" id="bellagio_hp" name="bellagio_hp" tabindex="-1" autocomplete="off" />
              </div>

              <!-- Full Name -->
              <div class="form-group">
                <label for="contactName" class="form-label">Nombre y Apellido <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="contactName" 
                  name="name" 
                  class="form-input" 
                  placeholder="Ej. Carlos Mendoza" 
                  required 
                  minlength="3" 
                  maxlength="80" 
                />
                <span class="form-error-msg" id="nameError">Por favor ingresa tu nombre completo (mínimo 3 caracteres).</span>
              </div>

              <!-- Email & Phone in 2 columns -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                <div class="form-group">
                  <label for="contactEmail" class="form-label">Correo Electrónico <span class="required">*</span></label>
                  <input 
                    type="email" 
                    id="contactEmail" 
                    name="email" 
                    class="form-input" 
                    placeholder="carlos@ejemplo.com" 
                    required 
                    maxlength="100" 
                  />
                  <span class="form-error-msg" id="emailError">Ingresa un correo electrónico válido.</span>
                </div>

                <div class="form-group">
                  <label for="contactPhone" class="form-label">Teléfono / WhatsApp <span class="required">*</span></label>
                  <input 
                    type="tel" 
                    id="contactPhone" 
                    name="phone" 
                    class="form-input" 
                    placeholder="+58 414 1234567" 
                    required 
                    maxlength="20" 
                  />
                  <span class="form-error-msg" id="phoneError">Ingresa un número telefónico válido.</span>
                </div>
              </div>



              <!-- Message -->
              <div class="form-group">
                <label for="contactMessage" class="form-label">¿En qué podemos ayudarte? <span class="required">*</span></label>
                <textarea 
                  id="contactMessage" 
                  name="message" 
                  class="form-textarea" 
                  rows="4" 
                  placeholder="Cuéntanos qué muebles o espacios deseas transformar (sala, comedor, recámara...)" 
                  required 
                  minlength="10" 
                  maxlength="1500"
                ></textarea>
                <span class="form-error-msg" id="messageError">El mensaje debe tener al menos 10 caracteres.</span>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-2);" id="submitBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                <span>Enviar Mensaje</span>
              </button>
            </form>
          </div>

          <!-- Contact Information & Fast Direct Channels -->
          <div class="luxury-card contact-info-card reveal-item reveal-delay-2">
            <span class="section-tag" style="margin-bottom: var(--space-3);">Canales Directos</span>
            <h3 style="font-size: 1.5rem; margin-bottom: var(--space-2);">Información de Contacto</h3>
            <p style="font-size: 0.92rem;">
              Comunícate directamente con nuestro equipo central de atención al cliente en Caracas.
            </p>

            <div class="contact-method-list">
              <!-- WhatsApp -->
              <div class="contact-method-item">
                <div class="contact-method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </div>
                <div class="contact-method-content">
                  <h4>WhatsApp Oficial</h4>
                  <a href="https://wa.me/584141536516" target="_blank" rel="noopener noreferrer">+58 414 1536516</a>
                </div>
              </div>

              <!-- Email -->
              <div class="contact-method-item">
                <div class="contact-method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="contact-method-content">
                  <h4>Correo de Atención</h4>
                  <a href="mailto:contacto@mueblesbellagio.com">contacto@mueblesbellagio.com</a>
                </div>
              </div>

              <!-- Location summary -->
              <div class="contact-method-item">
                <div class="contact-method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="contact-method-content">
                  <h4>Sede Principal</h4>
                  <p>Av. Comercio, Caracas, Distrito Capital, Venezuela.</p>
                </div>
              </div>

              <!-- Schedule -->
              <div class="contact-method-item">
                <div class="contact-method-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div class="contact-method-content">
                  <h4>Horario de Atención</h4>
                  <p>Lunes a Sábado: 9:00 AM - 6:30 PM</p>
                </div>
              </div>
            </div>

            <!-- Instant WhatsApp Box -->
            <div style="margin-top: var(--space-8); padding: var(--space-5); background: rgba(37, 211, 102, 0.08); border: 1px solid rgba(37, 211, 102, 0.25); border-radius: var(--radius-md);">
              <h4 style="color: var(--whatsapp-color); font-size: 1rem; margin-bottom: 4px;">¿Necesitas respuesta inmediata?</h4>
              <p style="font-size: 0.85rem; margin-bottom: var(--space-4);">Chatea directamente con uno de nuestros asesores en línea.</p>
              <a href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20asesor%C3%ADa%20inmediata." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="width: 100%;">
                Abrir Chat de WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Sets up form event validation, honeypot check, and rate limiting.
 */
export function setupContactEvents() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');
  const rateLimiter = createRateLimiter(20000); // 20s cooldown

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Honeypot check (anti-bot)
    const honeypot = document.getElementById('bellagio_hp')?.value;
    if (honeypot) {
      console.warn('Bot detected by honeypot.');
      return;
    }

    // 2. Rate limiting check
    if (!rateLimiter()) {
      showFeedback(feedback, 'Por favor espera unos momentos antes de enviar otro mensaje.', 'error');
      return;
    }

    // 3. Extract and sanitize inputs
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const storeInput = document.getElementById('contactStore');
    const messageInput = document.getElementById('contactMessage');

    const name = sanitizeInput(nameInput?.value || '');
    const email = sanitizeInput(emailInput?.value || '');
    const phone = sanitizeInput(phoneInput?.value || '');
    const store = sanitizeInput(storeInput?.value || '');
    const message = sanitizeInput(messageInput?.value || '');

    // Reset error states
    let isValid = true;
    toggleError('nameError', nameInput, name.length < 3);
    if (name.length < 3) isValid = false;

    const emailValid = validateEmail(email);
    toggleError('emailError', emailInput, !emailValid);
    if (!emailValid) isValid = false;

    const phoneValid = validatePhone(phone);
    toggleError('phoneError', phoneInput, !phoneValid);
    if (!phoneValid) isValid = false;

    toggleError('messageError', messageInput, message.length < 10);
    if (message.length < 10) isValid = false;

    if (!isValid) {
      showFeedback(feedback, 'Por favor corrige los campos marcados en rojo.', 'error');
      return;
    }

    // 4. Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.85"></path>
        </svg>
        <span>Enviando mensaje...</span>
      `;
    }

    // Simulate safe send & prepare WhatsApp direct backup
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>¡Mensaje Enviado con Éxito!</span>
        `;
      }

      showFeedback(feedback, `¡Gracias ${escapeHTML(name)}! Hemos recibido tu solicitud para ${escapeHTML(store)}. Un asesor te contactará a la brevedad.`, 'success');
      form.reset();

      // Clear success button label after 4s
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>Enviar Mensaje</span>
          `;
        }
      }, 4000);
    }, 800);
  });
}

function toggleError(errorId, inputElement, isError) {
  const errorSpan = document.getElementById(errorId);
  if (isError) {
    inputElement?.classList.add('error');
    inputElement?.classList.remove('valid');
    errorSpan?.classList.add('visible');
  } else {
    inputElement?.classList.remove('error');
    inputElement?.classList.add('valid');
    errorSpan?.classList.remove('visible');
  }
}

function showFeedback(el, message, type) {
  if (!el) return;
  el.className = `form-feedback ${type}`;
  el.textContent = message;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
