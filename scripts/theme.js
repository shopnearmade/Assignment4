/**
 * @module theme
 * @description Manages the application's theme state
 */

import { getItem, setItem } from './storage.js';
 

/**
 * Applies a theme   
 * @param {string} selectedTheme the theme value to apply    
 */
export function applyTheme(selectedTheme) {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    setItem('theme', selectedTheme);
}

/**
 * initialize the  dropdown restoring the saved theme
 */
export function initTheme() {
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = getItem('theme');

    if (savedTheme) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
    }

    themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));
}
