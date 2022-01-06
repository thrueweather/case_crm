import { createTheme } from '@mui/material/styles';

export default createTheme({
    breakpoints: {
        values: {
            xxs: 0,
            xs: 300,
            sm: 767,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    red: {
        light: '#f7836e',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
    },
});
