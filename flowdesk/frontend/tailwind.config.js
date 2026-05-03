export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        brand: { 50:'#f0f4ff', 100:'#e0e9ff', 200:'#c7d7fe', 400:'#818cf8', 500:'#6366f1', 600:'#4f46e5', 700:'#4338ca' },
        surface: { 0:'#ffffff', 50:'#f8f9fc', 100:'#f1f3f9', 200:'#e4e7f0' },
        ink: { 900:'#0f1117', 700:'#2d3148', 500:'#5a6080', 300:'#9299b0', 200:'#c4c9db' }
      },
      boxShadow: {
        card:  '0 1px 3px rgba(15,17,23,0.06)',
        panel: '0 4px 24px rgba(15,17,23,0.12)',
        glow:  '0 0 0 3px rgba(99,102,241,0.18)'
      },
      animation: {
        'fade-up':   'fadeUp 0.3s ease-out',
        'slide-in':  'slideIn 0.28s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeUp:  { from: { transform:'translateY(12px)', opacity:0 }, to: { transform:'translateY(0)', opacity:1 } },
        slideIn: { from: { transform:'translateX(100%)', opacity:0 }, to: { transform:'translateX(0)', opacity:1 } },
      }
    }
  },
  plugins: []
};