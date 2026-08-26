/**
 * @file scroll-top.js
 * @description Floating Scroll to Top button with dynamic scroll progress indicator.
 */

export function renderScrollTopButton() {
  return `
    <button 
      type="button" 
      class="scroll-top-btn" 
      id="scrollTopBtn" 
      aria-label="Volver al inicio de la página"
      title="Volver al inicio"
    >
      <svg class="scroll-progress-ring" width="48" height="48" viewBox="0 0 36 36">
        <path
          class="scroll-progress-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          id="scrollProgressCircle"
          class="scroll-progress-bar"
          stroke-dasharray="100, 100"
          stroke-dashoffset="100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div class="scroll-top-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    </button>
  `;
}
