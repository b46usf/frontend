export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#071A2F',
        royal: '#155EEF',
        gold: '#F5B942',
        soft: '#F8FAFC',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(21, 94, 239, 0.24)',
        gold: '0 16px 38px rgba(245, 185, 66, 0.18)',
      },
      borderRadius: {
        mobile: '22px',
      },
    },
  },
  plugins: [],
};
