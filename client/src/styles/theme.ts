export const theme = {
  colors: {
    primary: {
      main: '#D4AF37', // Gold
      light: '#F4E4A7',
      dark: '#B8941F',
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #F4E4A7 100%)',
    },
    secondary: {
      main: '#FF6B9D', // Pink
      light: '#FFB3D1',
      dark: '#E54B7A',
      gradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFB3D1 100%)',
    },
    background: {
      primary: '#0A0A0A', // Very dark black
      secondary: '#1A1A1A', // Dark gray
      tertiary: '#2A2A2A', // Medium dark gray
      card: '#1F1F1F',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      muted: '#808080',
      accent: '#D4AF37',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    border: {
      primary: '#333333',
      secondary: '#404040',
      accent: '#D4AF37',
    },
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px',
    xl: '1440px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    gold: '0 0 20px rgba(212, 175, 55, 0.3)',
    pink: '0 0 20px rgba(255, 107, 157, 0.3)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};