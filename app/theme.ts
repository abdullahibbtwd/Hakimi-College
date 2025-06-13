import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FAE27C',
      light: '#FEFCEB',
      dark: '#F7BA34',
      contrastText: '#000000',
    },
    secondary: {
      main: '#C3EBFA',
      light: '#EDF9F0',
      dark: '#69A79C',
      contrastText: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme; 