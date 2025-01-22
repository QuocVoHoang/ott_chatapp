'use client';
import { createTheme } from '@mui/material/styles';

// declare module '@mui/material/styles' {
//   interface Palette {
//     color: Palette['primary'];
//   }

//   interface PaletteOptions {
//     color?: PaletteOptions['primary'];
//   }
// }

const theme = createTheme({
  palette: {
    primary: {
      main: "#F26B42",
    },
    secondary: {
      main: "#2B518E"
    },
    background: {
      default: "#F5F5F5",
    },
    text: {
      primary: "#000000",
      secondary: "#FFFFFF"
    }
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

export default theme;