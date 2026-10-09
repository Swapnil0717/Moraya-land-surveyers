/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--page)',
        surface: 'var(--bg)',
        ink: 'var(--ink)',
        body: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--border)',
        placeholder: 'var(--ph)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'on-primary': 'var(--on-primary)',
        danger: 'var(--danger)',
        'danger-bg': 'var(--danger-bg)',
        panel: 'var(--panel)',
        'panel-text': 'var(--panel-text)',
        'panel-muted': 'var(--panel-muted)',
        'panel-line': 'var(--panel-line)',
      },
      fontFamily: {
        sans: ['"Public Sans"', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
