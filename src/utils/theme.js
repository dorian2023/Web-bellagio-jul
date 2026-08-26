/**
 * @file theme.js
 * @description Theme management (Dark / Light mode) with localStorage persistence and OS preference detection.
 */

const THEME_KEY = 'bellagio_theme_preference';

/**
 * Initializes the theme controller and binds listener to toggle button.
 * @param {HTMLElement} toggleBtn 
 */
export function initTheme(toggleBtn) {
  // Determine initial theme: saved preference or system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Default to dark for luxury branding

  applyTheme(initialTheme);
  updateToggleButton(toggleBtn, initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
      updateToggleButton(toggleBtn, nextTheme);
    });
  }

  // Listen to OS theme changes if user has not set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      updateToggleButton(toggleBtn, newTheme);
    }
  });
}

/**
 * Applies theme to HTML document element.
 * @param {'dark'|'light'} theme 
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Updates toggle button SVG icons.
 * @param {HTMLElement} toggleBtn 
 * @param {'dark'|'light'} theme 
 */
function updateToggleButton(toggleBtn, theme) {
  if (!toggleBtn) return;
  if (theme === 'dark') {
    // Sun icon for switching to light mode
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    toggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
    toggleBtn.setAttribute('title', 'Modo Claro');
  } else {
    // Moon icon for switching to dark mode
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    toggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    toggleBtn.setAttribute('title', 'Modo Oscuro');
  }
}
