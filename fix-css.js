import fs from 'fs';

const currentContent = fs.readFileSync('src/styles/sections.css', 'utf8');

// Everything from line 3 onward (after the two empty lines) is the good content starting at ".nav-link:hover,"
// We need to prepend the missing navbar selectors

const goodContentStart = currentContent.indexOf('.nav-link:hover,');

const goodContent = goodContentStart >= 0 ? currentContent.substring(goodContentStart) : currentContent;

const navbarHeader = `/**
 * @file sections.css
 * @description Layout and styling for all landing page sections.
 */

/* ==========================================================================
   1. Navbar
   ========================================================================== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--nav-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--nav-border);
  transition: padding var(--transition-normal), background-color var(--transition-normal), box-shadow var(--transition-normal);
  padding: 1.1rem 0;
}

.navbar.scrolled {
  padding: 0.75rem 0;
  box-shadow: var(--shadow-sm);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.navbar-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo-img {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  box-shadow: 0 0 16px rgba(197, 165, 90, 0.45);
  border: 1.5px solid var(--gold-400);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.navbar-brand:hover .brand-logo-img {
  transform: scale(1.08);
  box-shadow: 0 0 24px rgba(197, 165, 90, 0.75);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  list-style: none;
}

.nav-link {
  font-family: var(--font-accent);
  font-size: 0.88rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  position: relative;
  padding: 0.35rem 0;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--gradient-gold);
  transition: width var(--transition-normal);
  border-radius: var(--radius-full);
}

`;

const fixedContent = navbarHeader + goodContent;

fs.writeFileSync('src/styles/sections.css', fixedContent);
console.log('sections.css fixed successfully!');
