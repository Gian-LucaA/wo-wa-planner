import { extendTheme } from '@mui/joy/styles';

declare module '@mui/joy/styles' {
  interface Palette {
    custom: {
      background: string;
    };
  }

  interface PaletteLight {
    custom: {
      background: string;
    };
  }

  interface PaletteDark {
    custom: {
      background: string;
    };
  }
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        custom: {
          background: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
    dark: {
      palette: {
        custom: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  },
});

export default theme;
