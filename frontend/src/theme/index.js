import { createTheme } from '@mui/material/styles';
import '../assets/Font.scss';

const theme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#24b9db',
        contrastText: '#ffffff',
        dark: '#0190b0',
        light: '#24b9db',
      },
      Secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2'
      },
      custom: {
        light: '#60ad5e',
        main: '#2e7d32',
        dark: '#005005',
        contrastText: 'rgba(0, 0, 0, 0.87)',
      },
      inherit: {
        main: '#686963',
        light: '#F1EDEE',
        dark: '#3D5467',
      }
    },
    typography: {
      fontFamily: ["'Noto Sans KR', sans-serif",
                  ],
      subtitle1: {
        fontSize: 12,
      },
      body1: {
        fontWeight: 500,
      },
      navTitle: {
        fontSize: 15,
        fontWeight: 600
      }
    },

    //이 아래부분은 크게 신경쓰지 않으셔도 됩니다.
    overrides: {
      MuiSwitch: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + $track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity: 1,
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  });

  export default theme;