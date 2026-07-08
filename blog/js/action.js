// This runs safely after the DOM elements (like #themeToggle) are loaded
const toggle = document.getElementById('themeToggle');

toggle.addEventListener('click', () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});
