/**
 * Attempts to register PDF fonts and provides fallback options
 */
import { Font } from '@react-pdf/renderer';

// Font registration function with fallbacks
export const registerFonts = () => {
  try {
    // Try to register Roboto from CDN
    Font.register({
      family: 'Roboto',
      fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
      ]
    });
    
    // Register fallback font (Helvetica is supported by PDF by default)
    Font.registerHyphenationCallback(word => [word]);
  } catch (error) {
    console.error('Error registering fonts:', error);
  }
};

// Get the font family based on what's available
export const getAvailableFontFamily = () => {
  return 'Helvetica, Roboto, sans-serif';
};
