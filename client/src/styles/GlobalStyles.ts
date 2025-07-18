import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    line-height: 1.5;
    min-height: 100vh;
  }

  .App {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    font-weight: ${theme.fontWeights.semibold};
    line-height: 1.2;
    margin-bottom: ${theme.spacing.md};
  }

  h1 {
    font-size: ${theme.fontSizes['4xl']};
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.fontSizes['3xl']};
    }
  }

  h2 {
    font-size: ${theme.fontSizes['3xl']};
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.fontSizes['2xl']};
    }
  }

  h3 {
    font-size: ${theme.fontSizes['2xl']};
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.fontSizes.xl};
    }
  }

  h4 {
    font-size: ${theme.fontSizes.xl};
  }

  h5 {
    font-size: ${theme.fontSizes.lg};
  }

  h6 {
    font-size: ${theme.fontSizes.base};
  }

  p {
    margin-bottom: ${theme.spacing.md};
    line-height: 1.6;
  }

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    transition: ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary.light};
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: ${theme.transitions.fast};

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    font-family: inherit;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.main};
    border-radius: ${theme.borderRadius.base};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary.light};
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: ${theme.colors.primary.main};
    color: ${theme.colors.background.primary};
  }

  /* Loading spinner animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Fade in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Slide up animation */
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .slide-up {
    animation: slideUp 0.8s ease-out;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Container */
  .container {
    max-width: ${theme.breakpoints.xl};
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.tablet}) {
      padding: 0 ${theme.spacing.sm};
    }
  }

  /* Grid system */
  .grid {
    display: grid;
    gap: ${theme.spacing.lg};
  }

  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      grid-template-columns: 1fr;
    }
  }

  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
    
    @media (max-width: ${theme.breakpoints.desktop}) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      grid-template-columns: 1fr;
    }
  }

  .grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
    
    @media (max-width: ${theme.breakpoints.desktop}) {
      grid-template-columns: repeat(3, 1fr);
    }
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: ${theme.breakpoints.mobile}) {
      grid-template-columns: 1fr;
    }
  }

  /* Flexbox utilities */
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .gap-sm {
    gap: ${theme.spacing.sm};
  }

  .gap-md {
    gap: ${theme.spacing.md};
  }

  .gap-lg {
    gap: ${theme.spacing.lg};
  }

  /* Spacing utilities */
  .mt-sm { margin-top: ${theme.spacing.sm}; }
  .mt-md { margin-top: ${theme.spacing.md}; }
  .mt-lg { margin-top: ${theme.spacing.lg}; }
  .mt-xl { margin-top: ${theme.spacing.xl}; }

  .mb-sm { margin-bottom: ${theme.spacing.sm}; }
  .mb-md { margin-bottom: ${theme.spacing.md}; }
  .mb-lg { margin-bottom: ${theme.spacing.lg}; }
  .mb-xl { margin-bottom: ${theme.spacing.xl}; }

  .pt-sm { padding-top: ${theme.spacing.sm}; }
  .pt-md { padding-top: ${theme.spacing.md}; }
  .pt-lg { padding-top: ${theme.spacing.lg}; }
  .pt-xl { padding-top: ${theme.spacing.xl}; }

  .pb-sm { padding-bottom: ${theme.spacing.sm}; }
  .pb-md { padding-bottom: ${theme.spacing.md}; }
  .pb-lg { padding-bottom: ${theme.spacing.lg}; }
  .pb-xl { padding-bottom: ${theme.spacing.xl}; }

  .px-sm { padding-left: ${theme.spacing.sm}; padding-right: ${theme.spacing.sm}; }
  .px-md { padding-left: ${theme.spacing.md}; padding-right: ${theme.spacing.md}; }
  .px-lg { padding-left: ${theme.spacing.lg}; padding-right: ${theme.spacing.lg}; }

  .py-sm { padding-top: ${theme.spacing.sm}; padding-bottom: ${theme.spacing.sm}; }
  .py-md { padding-top: ${theme.spacing.md}; padding-bottom: ${theme.spacing.md}; }
  .py-lg { padding-top: ${theme.spacing.lg}; padding-bottom: ${theme.spacing.lg}; }
`;