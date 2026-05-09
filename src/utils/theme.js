// Theme utilities for client-side theme switching

const THEME_KEY = 'me_theme';
const VALID_THEMES = ['light', 'dark'];
const DEFAULT_THEME = 'light';

/**
 * Get current theme from localStorage or default
 */
export function getTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_KEY);
  return VALID_THEMES.includes(stored) ? stored : DEFAULT_THEME;
}

/**
 * Set theme and apply to document
 */
export function setTheme(theme) {
  if (!VALID_THEMES.includes(theme)) return;
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  // Dispatch event for other components to listen
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Toggle between light and dark
 */
export function toggleTheme() {
  const current = getTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
}

/**
 * Initialize theme on page load
 */
export function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

/**
 * Listen for theme changes
 */
export function onThemeChange(callback) {
  window.addEventListener('themechange', (e) => callback(e.detail.theme));
}